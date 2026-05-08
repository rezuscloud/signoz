// Package v2 is the redesigned pkg/errors.
//
// Every branch-worthy field on the Error struct is a closed enum and every
// variable part is a typed key/value. The intent is to make errors first-class
// data for programmatic consumers — SDK clients, UI surfaces, alerting, and
// LLM agents — without sacrificing human readability.
//
// Domain and op are encoded into Code (e.g. "query.parse.unknown_function")
// rather than carried as separate struct fields. Frames[0] is the
// authoritative call-site location, captured at construction time.
package v2

import (
	stderrors "errors"
	"fmt"
	"io"
	"sort"
	"strconv"
	"strings"
)

// Error is the redesigned error value. *Error is the canonical form passed
// around — the zero value is unused, construct via New / Newf / Wrap / Wrapf.
//
// Frames are intentionally not a struct field: resolving captured PCs into
// func/file/line is the dominant construction cost, so we capture PCs eagerly
// at construction time (so the snapshot is faithful to the call site) and
// resolve them lazily via Frames() only when something actually inspects them.
type Error struct {
	// WHAT
	Category Category
	Code     Code
	Title    string
	Detail   string

	// WHY / WHO
	Cause error
	Fault Fault

	// WHAT NEXT
	Retry       Retry
	Remediation Remediation
	Refs        map[RefKind]string

	// CONTEXT
	Attrs   map[string]any
	TraceID string
	SpanID  string

	// stack is the captured PCs plus a memoized []Frame; never read directly,
	// always go through Frames().
	stack *frameStack
}

// Frames returns the captured stack, resolved to func/file/line on first
// access. Frames[0] is the constructor's caller. Safe for concurrent use.
func (e *Error) Frames() []Frame {
	if e == nil {
		return nil
	}
	return e.stack.frames()
}

// New creates an Error for a registered Code. Defaults from the registered
// Meta are applied first; opts override per call site.
func New(code Code, title string, opts ...Option) *Error {
	e := &Error{Code: code, Title: title, stack: captureStack(3)}
	applyMeta(e)
	for _, opt := range opts {
		opt(e)
	}
	return e
}

// Newf is New with fmt.Sprintf-style formatting for the title.
func Newf(code Code, format string, args ...any) *Error {
	e := &Error{Code: code, Title: fmt.Sprintf(format, args...), stack: captureStack(3)}
	applyMeta(e)
	return e
}

// Wrap creates an Error that wraps cause. The new error's Title is the
// caller-supplied title (not the cause's message), so Error() reports what
// went wrong at this layer — the cause is reachable via Unwrap.
func Wrap(cause error, code Code, title string, opts ...Option) *Error {
	e := &Error{Code: code, Title: title, Cause: cause, stack: captureStack(3)}
	applyMeta(e)
	for _, opt := range opts {
		opt(e)
	}
	return e
}

// Wrapf is Wrap with fmt.Sprintf-style formatting for the title.
func Wrapf(cause error, code Code, format string, args ...any) *Error {
	e := &Error{Code: code, Title: fmt.Sprintf(format, args...), Cause: cause, stack: captureStack(3)}
	applyMeta(e)
	return e
}

// applyMeta copies default values from the registered Meta into a fresh
// Error. It runs before per-call options so options win.
func applyMeta(e *Error) {
	meta, ok := MetaOf(e.Code)
	if !ok {
		return
	}
	if (e.Category == Category{}) {
		e.Category = meta.Category
	}
	if (e.Fault == Fault{}) {
		e.Fault = meta.Fault
	}
	if (e.Retry == Retry{}) {
		e.Retry = meta.Retry
	}
	if (e.Remediation == Remediation{}) {
		e.Remediation = meta.Remediation
	}
	if len(meta.Refs) > 0 {
		if e.Refs == nil {
			e.Refs = make(map[RefKind]string, len(meta.Refs))
		}
		for k, v := range meta.Refs {
			if _, exists := e.Refs[k]; !exists {
				e.Refs[k] = v
			}
		}
	}
}

// Error returns the Title (the message specifically attached at this wrap
// site), not the cause's message. This fixes the v1 surprise where Error()
// returned the wrapped cause's text.
func (e *Error) Error() string {
	if e == nil {
		return "<nil>"
	}
	return e.Title
}

// Unwrap returns the wrapped cause, enabling errors.Is / errors.As.
func (e *Error) Unwrap() error {
	if e == nil {
		return nil
	}
	return e.Cause
}

// Format implements fmt.Formatter.
//
//	%s, %v   →  Title only
//	%+v      →  full chain: code, title, frames, attrs, recursive cause
func (e *Error) Format(f fmt.State, verb rune) {
	switch verb {
	case 's':
		_, _ = io.WriteString(f, e.Title)
	case 'v':
		if f.Flag('+') {
			_, _ = io.WriteString(f, e.fullString())
			return
		}
		_, _ = io.WriteString(f, e.Title)
	case 'q':
		fmt.Fprintf(f, "%q", e.Title)
	default:
		fmt.Fprintf(f, "%%!%c(*errors/v2.Error)", verb)
	}
}

// fullString produces the %+v rendering. Format is intentionally
// human-readable rather than machine-parseable; consumers that want structure
// should marshal to JSON.
func (e *Error) fullString() string {
	var b strings.Builder
	e.appendFull(&b, 0)
	return b.String()
}

func (e *Error) appendFull(b *strings.Builder, depth int) {
	indent := strings.Repeat("  ", depth)
	fmt.Fprintf(b, "%s[%s] %s\n", indent, e.Code.s, e.Title)
	if e.Detail != "" {
		fmt.Fprintf(b, "%s  detail: %s\n", indent, e.Detail)
	}
	if len(e.Attrs) > 0 {
		// Stable key order for deterministic output.
		keys := make([]string, 0, len(e.Attrs))
		for k := range e.Attrs {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		fmt.Fprintf(b, "%s  attrs:\n", indent)
		for _, k := range keys {
			fmt.Fprintf(b, "%s    %s=%v\n", indent, k, e.Attrs[k])
		}
	}
	if frames := e.Frames(); len(frames) > 0 {
		fmt.Fprintf(b, "%s  frames:\n", indent)
		for _, fr := range frames {
			fmt.Fprintf(b, "%s    %s\n%s      %s:%s\n", indent, fr.Func, indent, fr.File, strconv.Itoa(fr.Line))
		}
	}
	if e.Cause != nil {
		fmt.Fprintf(b, "%scaused by:\n", indent)
		var ce *Error
		if stderrors.As(e.Cause, &ce) && ce != nil {
			ce.appendFull(b, depth+1)
		} else {
			fmt.Fprintf(b, "%s  %s\n", indent, e.Cause.Error())
		}
	}
}

// AsError extracts a *Error from anywhere in err's wrap chain. It is the
// common shortcut around errors.As for code that always wants this package's
// type.
func AsError(err error) (*Error, bool) {
	if err == nil {
		return nil, false
	}
	var e *Error
	if stderrors.As(err, &e) {
		return e, true
	}
	return nil, false
}

// Is reports whether err or any error in its chain has the given Code.
// Convenience wrapper that's friendlier than errors.As at call sites that
// only care about code identity.
func Is(err error, code Code) bool {
	e, ok := AsError(err)
	if !ok {
		return false
	}
	for e != nil {
		if e.Code == code {
			return true
		}
		next, ok := AsError(e.Cause)
		if !ok {
			return false
		}
		e = next
	}
	return false
}
