package v2

// This file is a self-contained walkthrough of how a domain integrates with
// pkg/errors/v2. It mirrors what a real pkg/<domain>/errors.go looks like in
// practice — registering codes, constructing typed errors at failure sites,
// and consuming them at API boundaries. The "example.*" namespace is reserved
// for these demo codes so they never collide with a real domain's
// registrations.

// 1. Register codes at package init time. Each Register call panics on
// malformed code or duplicate registration, so misconfiguration is caught
// at process boot, not at first failure.
var (
	// A caller-fault, fix-the-input error: rejected before any work happens.
	exampleCodeInvalidQuery = Register("example.query.invalid_filter", Meta{
		Category:    CategoryInvalidInput,
		Fault:       FaultCaller,
		Remediation: RemediationFixInput,
		Retry:       Retry{Policy: RetryAfterFix},
		Refs: map[RefKind]string{
			RefDocs: "https://signoz.io/docs/query/filters",
		},
	})

	// A quota error: the caller's request was well-formed but their plan
	// doesn't allow it. The recommended remediation is structural (upgrade),
	// not "try again later."
	exampleCodeQuotaExceeded = Register("example.billing.quota_exceeded", Meta{
		Category:    CategoryResourceExhausted,
		Fault:       FaultCaller,
		Remediation: RemediationUpgradeLicense,
		Retry:       Retry{Policy: RetryNever},
	})
)

// 2. Construct errors at the failure site. Notice that variable parts of
// the message (the offending field, the limits) live in typed Attrs, not in
// the title prose — a downstream agent can read them without parsing English.
func exampleRejectInvalidFilter(field string) *Error {
	return New(exampleCodeInvalidQuery, "filter is not supported",
		WithAttr("field", field),
	)
}

// 3. Consume errors at the API boundary. Branching on Category gives the
// HTTP status; Retry tells an SDK how to behave; Fault drives logging
// classification (caller errors are warnings, server/upstream errors page).
func exampleClassifyForHTTP(err error) (status int, retry RetryPolicy) {
	e, ok := AsError(err)
	if !ok {
		return 500, RetryNever
	}
	switch e.Category {
	case CategoryInvalidInput, CategoryPrecondition:
		status = 400
	case CategoryUnauthenticated:
		status = 401
	case CategoryForbidden:
		status = 403
	case CategoryNotFound:
		status = 404
	case CategoryConflict, CategoryAlreadyExists:
		status = 409
	case CategoryResourceExhausted:
		status = 429
	case CategoryUnavailable, CategoryTimeout:
		status = 503
	case CategoryUnimplemented:
		status = 501
	default:
		status = 500
	}
	return status, e.Retry.Policy
}

// 4. Identify a specific failure mode by Code. Is walks the cause chain so
// a wrapper at the HTTP layer still matches when the root cause was raised
// deep in the call graph.
func exampleIsQuotaExceeded(err error) bool {
	return Is(err, exampleCodeQuotaExceeded)
}

// The example helpers are reference-only: they exist to document call-site
// patterns, not to be called from anywhere in the binary. This anchor keeps
// them visible to readers (and the linter) without exporting demo code.
var _ = []any{
	exampleRejectInvalidFilter,
	exampleClassifyForHTTP,
	exampleIsQuotaExceeded,
}
