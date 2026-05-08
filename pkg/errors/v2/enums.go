package v2

// The enums in this file are closed sets. Each value is a package-level var of
// an unexported-field struct, so external code cannot synthesize new values —
// it must reference one of the defined ones. String() returns the stable
// snake_case wire name; once shipped, those names are append-only.

// Category groups errors by what kind of failure occurred. It is the coarsest
// branch-worthy axis and is intended to be a superset of gRPC status codes
// extended with cases SigNoz cares about (e.g. license issues land under
// FailedDependency or ResourceExhausted depending on context).
type Category struct{ s string }

func (c Category) String() string { return c.s }

var (
	CategoryInvalidInput      = Category{"invalid_input"}      // request was malformed or violated a documented constraint.
	CategoryNotFound          = Category{"not_found"}          // referenced resource does not exist.
	CategoryAlreadyExists     = Category{"already_exists"}     // resource creation conflicts with an existing one.
	CategoryConflict          = Category{"conflict"}           // concurrent modification or state mismatch (e.g. stale revision).
	CategoryPrecondition      = Category{"precondition"}       // a required precondition (system or caller-asserted) was not met.
	CategoryUnauthenticated   = Category{"unauthenticated"}    // credentials are missing or invalid.
	CategoryForbidden         = Category{"forbidden"}          // authenticated but not authorized for this action.
	CategoryResourceExhausted = Category{"resource_exhausted"} // quota, rate limit, or other budget exceeded.
	CategoryFailedDependency  = Category{"failed_dependency"}  // an upstream service we depend on failed (db, license, etc.).
	CategoryUnavailable       = Category{"unavailable"}        // service is temporarily down; retry with backoff.
	CategoryTimeout           = Category{"timeout"}            // deadline exceeded before the operation completed.
	CategoryCanceled          = Category{"canceled"}           // caller or context canceled the operation.
	CategoryUnimplemented     = Category{"unimplemented"}      // operation is not supported (or not yet) by this server.
	CategoryDataLoss          = Category{"data_loss"}          // unrecoverable data corruption or loss detected.
	CategoryInternal          = Category{"internal"}           // bug — invariant broken; should not occur in normal operation.
)

// Fault attributes responsibility. An agent uses this to decide whether to
// fix the request (Caller), retry/escalate (Server, Upstream), or page a
// human (Operator).
type Fault struct{ s string }

func (f Fault) String() string { return f.s }

var (
	FaultCaller   = Fault{"caller"}
	FaultServer   = Fault{"server"}
	FaultUpstream = Fault{"upstream"}
	FaultOperator = Fault{"operator"}
)

// RetryPolicy tells the caller how to behave on retry. Backoff implies the
// caller should use its own backoff schedule; After means honor Retry.After
// exactly; AfterFix and AfterAuth signal that retry is pointless until the
// caller fixes the request or re-authenticates.
type RetryPolicy struct{ s string }

func (r RetryPolicy) String() string { return r.s }

var (
	RetryNever     = RetryPolicy{"never"}
	RetryImmediate = RetryPolicy{"immediate"}
	RetryBackoff   = RetryPolicy{"backoff"}
	RetryAfter     = RetryPolicy{"after"}
	RetryAfterFix  = RetryPolicy{"after_fix"}
	RetryAfterAuth = RetryPolicy{"after_auth"}
)

// Remediation names the single recommended next action. It does not execute.
type Remediation struct{ s string }

func (r Remediation) String() string { return r.s }

var (
	RemediationNone            = Remediation{"none"}
	RemediationFixInput        = Remediation{"fix_input"}
	RemediationReauthenticate  = Remediation{"reauthenticate"}
	RemediationWaitAndRetry    = Remediation{"wait_and_retry"}
	RemediationFailover        = Remediation{"failover"}
	RemediationContactOperator = Remediation{"contact_operator"}
	RemediationFileBug         = Remediation{"file_bug"}
	RemediationUpgradeLicense  = Remediation{"upgrade_license"}
)

// RefKind classifies a reference URL attached to the error.
type RefKind struct{ s string }

func (r RefKind) String() string { return r.s }

var (
	RefDocs      = RefKind{"docs"}
	RefRunbook   = RefKind{"runbook"}
	RefDashboard = RefKind{"dashboard"}
	RefTrace     = RefKind{"trace"}
	RefSource    = RefKind{"source"}
	RefIssue     = RefKind{"issue"}
)
