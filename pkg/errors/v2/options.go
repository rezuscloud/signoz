package v2

import "time"

// Option mutates an Error during construction. Options are applied after the
// registered Meta defaults so a per-call WithFault wins over the code's
// default Fault.
type Option func(*Error)

// WithTitle overrides the title (used when Newf's formatted string is not
// what you want, or after a Wrap that took its title from the cause).
func WithTitle(s string) Option { return func(e *Error) { e.Title = s } }

// WithDetail adds a long, user-safe explanation. Detail must never include
// raw cause text; the cause is already in the chain.
func WithDetail(s string) Option { return func(e *Error) { e.Detail = s } }

// WithCategory overrides the registered Category.
func WithCategory(c Category) Option { return func(e *Error) { e.Category = c } }

// WithFault overrides the registered Fault.
func WithFault(f Fault) Option { return func(e *Error) { e.Fault = f } }

// WithRetry overrides the registered Retry.
func WithRetry(r Retry) Option { return func(e *Error) { e.Retry = r } }

// WithRetryAfter is a convenience for the common RetryAfter case.
func WithRetryAfter(d time.Duration) Option {
	return func(e *Error) { e.Retry = Retry{Policy: RetryAfter, After: d} }
}

// WithRemediation overrides the registered Remediation.
//
// Convention for "did you mean" hints: stash a []string under
// Attrs["suggestions"], ranked best-first. Each element should be a complete,
// copy-pasteable replacement — not an explanation of what went wrong (use
// WithDetail for that). Once 3-4 domains adopt the convention identically,
// promote to a first-class field.
func WithRemediation(r Remediation) Option { return func(e *Error) { e.Remediation = r } }

// WithRef adds (or replaces) a single reference URL keyed by kind.
func WithRef(kind RefKind, url string) Option {
	return func(e *Error) {
		if e.Refs == nil {
			e.Refs = make(map[RefKind]string, 1)
		}
		e.Refs[kind] = url
	}
}

// WithAttr sets a single typed attribute. Prefer typed per-domain helpers
// (e.g. WithQueryAttrs(q Query)) over raw WithAttr at call sites — they keep
// the attr keys consistent and let the compiler reject typos.
func WithAttr(key string, value any) Option {
	return func(e *Error) {
		if e.Attrs == nil {
			e.Attrs = make(map[string]any, 1)
		}
		e.Attrs[key] = value
	}
}

// WithAttrs merges a map of attributes; later keys win.
func WithAttrs(attrs map[string]any) Option {
	return func(e *Error) {
		if len(attrs) == 0 {
			return
		}
		if e.Attrs == nil {
			e.Attrs = make(map[string]any, len(attrs))
		}
		for k, v := range attrs {
			e.Attrs[k] = v
		}
	}
}

// WithTrace stamps the error with OTel trace and span IDs so the JSON
// response can link back to the originating span.
func WithTrace(traceID, spanID string) Option {
	return func(e *Error) {
		e.TraceID = traceID
		e.SpanID = spanID
	}
}
