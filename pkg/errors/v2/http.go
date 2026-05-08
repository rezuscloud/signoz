package v2

import (
	"encoding/json"
	"net/url"
)

// CodeUnknown is the sentinel returned when AsJSON / AsURLValues are called
// on a non-*Error. A consumer that sees this on the wire should read it as
// "the producer did not raise a v2 Error and we projected it through the
// fallback path" — i.e. somewhere upstream is still using std errors or v1.
var CodeUnknown = Register("unknown.unset", Meta{
	Category: CategoryInternal,
	Fault:    FaultServer,
	Retry:    Retry{Policy: RetryNever},
})

// JSON is the wire envelope for an Error. It is intentionally a superset of
// v1's pkg/errors.JSON: SDK clients that only read v1's {code, message, url,
// errors[]} keep working, while v2 consumers can branch on the new typed
// fields (category, fault, retry, remediation, attrs, refs, cause).
type JSON struct {
	Code        string            `json:"code" required:"true"`
	Title       string            `json:"title" required:"true"`
	Detail      string            `json:"detail,omitempty"`
	Category    string            `json:"category,omitempty"`
	Fault       string            `json:"fault,omitempty"`
	Retry       *RetryJSON        `json:"retry,omitempty"`
	Remediation string            `json:"remediation,omitempty"`
	Attrs       map[string]any    `json:"attrs,omitempty"`
	Refs        map[string]string `json:"refs,omitempty"`
	Frames      []Frame           `json:"frames,omitempty"`
	TraceID     string            `json:"trace_id,omitempty"`
	SpanID      string            `json:"span_id,omitempty"`
	Cause       *CauseJSON        `json:"cause,omitempty"`
}

// RetryJSON renders Retry as an object so consumers can branch on policy
// before consulting AfterMS. AfterMS is omitted unless policy is "after".
type RetryJSON struct {
	Policy  string `json:"policy"`
	AfterMS int64  `json:"after_ms,omitempty"`
}

// CauseJSON is the thin recursive shape for a cause chain. Only code, title,
// and a nested cause are guaranteed — producers may add more, consumers must
// not rely on it.
type CauseJSON struct {
	Code  string     `json:"code,omitempty"`
	Title string     `json:"title"`
	Cause *CauseJSON `json:"cause,omitempty"`
}

// AsJSON projects any error onto the v2 wire envelope. If cause is a
// *Error (anywhere in its wrap chain) every field is filled from it;
// otherwise the result is a CodeUnknown envelope with Title=cause.Error()
// so the wire shape is always valid and never panics.
func AsJSON(cause error) *JSON {
	if cause == nil {
		return nil
	}
	e, ok := AsError(cause)
	if !ok {
		return &JSON{
			Code:     CodeUnknown.s,
			Title:    cause.Error(),
			Category: CategoryInternal.s,
			Fault:    FaultServer.s,
		}
	}
	return errorToJSON(e)
}

func errorToJSON(e *Error) *JSON {
	out := &JSON{
		Code:        e.Code.s,
		Title:       e.Title,
		Detail:      e.Detail,
		Category:    e.Category.s,
		Fault:       e.Fault.s,
		Remediation: e.Remediation.s,
		Attrs:       e.Attrs,
		TraceID:     e.TraceID,
		SpanID:      e.SpanID,
	}
	if (e.Retry.Policy != RetryPolicy{}) {
		out.Retry = &RetryJSON{Policy: e.Retry.Policy.s}
		if e.Retry.Policy == RetryAfter && e.Retry.After > 0 {
			out.Retry.AfterMS = e.Retry.After.Milliseconds()
		}
	}
	if len(e.Refs) > 0 {
		out.Refs = make(map[string]string, len(e.Refs))
		for k, v := range e.Refs {
			out.Refs[k.s] = v
		}
	}
	if frames := e.Frames(); len(frames) > 0 {
		out.Frames = frames
	}
	if e.Cause != nil {
		out.Cause = causeToJSON(e.Cause)
	}
	return out
}

func causeToJSON(err error) *CauseJSON {
	if err == nil {
		return nil
	}
	if e, ok := err.(*Error); ok {
		c := &CauseJSON{Code: e.Code.s, Title: e.Title}
		if e.Cause != nil {
			c.Cause = causeToJSON(e.Cause)
		}
		return c
	}
	// Non-*Error leaf: only Title is set, no Code.
	return &CauseJSON{Title: err.Error()}
}

// AsURLValues projects an error onto a flat url.Values, matching v1's shape
// for callers (e.g. OAuth/SSO redirects) that smuggle errors back through a
// query string. Complex fields (attrs, refs, retry, frames, cause) are
// JSON-marshaled into a single value rather than spread across multiple
// keys, since query strings have no good representation for nested data.
func AsURLValues(cause error) url.Values {
	j := AsJSON(cause)
	if j == nil {
		return url.Values{}
	}
	v := url.Values{
		"code":  {j.Code},
		"title": {j.Title},
	}
	if j.Detail != "" {
		v.Set("detail", j.Detail)
	}
	if j.Category != "" {
		v.Set("category", j.Category)
	}
	if j.Fault != "" {
		v.Set("fault", j.Fault)
	}
	if j.Remediation != "" {
		v.Set("remediation", j.Remediation)
	}
	if j.TraceID != "" {
		v.Set("trace_id", j.TraceID)
	}
	if j.SpanID != "" {
		v.Set("span_id", j.SpanID)
	}
	if j.Retry != nil {
		if b, err := json.Marshal(j.Retry); err == nil {
			v.Set("retry", string(b))
		}
	}
	if len(j.Refs) > 0 {
		if b, err := json.Marshal(j.Refs); err == nil {
			v.Set("refs", string(b))
		}
	}
	if len(j.Attrs) > 0 {
		if b, err := json.Marshal(j.Attrs); err == nil {
			v.Set("attrs", string(b))
		}
	}
	if j.Cause != nil {
		if b, err := json.Marshal(j.Cause); err == nil {
			v.Set("cause", string(b))
		}
	}
	return v
}
