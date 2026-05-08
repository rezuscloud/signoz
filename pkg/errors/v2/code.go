package v2

import (
	"regexp"
	"sync"
	"time"
)

// Code is a dotted, hierarchical identifier registered at process start. It
// encodes domain (subsystem), op (verb), optional sub (qualifier), and a
// terminal reason. Codes are values; two Codes with the same string are equal
// by value and safe to compare with ==.
type Code struct{ s string }

// String returns the dotted code as it appears on the wire. Empty for the
// zero value.
func (c Code) String() string { return c.s }

// codePattern allows 2-4 dotted segments, each starting with a lowercase
// letter and continuing with [a-z0-9_]. One segment is too broad (use a
// domain prefix); five or more means the domain should be split.
var codePattern = regexp.MustCompile(`^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){1,3}$`)

// Meta is the per-code default envelope applied by constructors before
// per-call options. Every field has a natural per-code default — an auth
// code always wants Reauthenticate, every documented code wants its docs
// URL — so the registry is the right place to declare them once.
type Meta struct {
	Category    Category
	Fault       Fault
	Retry       Retry
	Remediation Remediation
	Refs        map[RefKind]string
}

// Retry tells the caller how and when to retry. After is meaningful only
// when Policy == RetryAfter.
type Retry struct {
	Policy RetryPolicy
	After  time.Duration
}

var (
	registryMu sync.RWMutex
	registry   = map[string]Meta{}
)

// Register installs a code with its default Meta and returns the Code value.
// It panics on a malformed code string or a duplicate registration — both
// indicate a programming error that must be caught at boot, not at first
// failure.
//
// Call from the owning domain's package init or top-level var block:
//
//	var CodeUnknownFunction = errors.Register("query.parse.unknown_function", errors.Meta{
//	    Category: errors.CategoryInvalidInput,
//	    Fault:    errors.FaultCaller,
//	    Retry:    errors.Retry{Policy: errors.RetryAfterFix},
//	})
func Register(s string, meta Meta) Code {
	if !codePattern.MatchString(s) {
		panic("errors/v2: malformed code: " + s)
	}
	registryMu.Lock()
	defer registryMu.Unlock()
	if _, ok := registry[s]; ok {
		panic("errors/v2: duplicate code: " + s)
	}
	registry[s] = meta
	return Code{s: s}
}

// MetaOf returns the Meta a code was registered with. Returns the zero Meta
// and false for unregistered or zero codes.
func MetaOf(c Code) (Meta, bool) {
	if c.s == "" {
		return Meta{}, false
	}
	registryMu.RLock()
	defer registryMu.RUnlock()
	m, ok := registry[c.s]
	return m, ok
}

// registerOrGet is the internal idempotent register used by adapters that
// may see the same code (e.g. legacy.<v1>) more than once across the process
// lifetime. It panics on malformed codes — duplicate codes silently keep the
// existing Meta.
func registerOrGet(s string, meta Meta) Code {
	if !codePattern.MatchString(s) {
		panic("errors/v2: malformed code: " + s)
	}
	registryMu.Lock()
	defer registryMu.Unlock()
	if _, ok := registry[s]; !ok {
		registry[s] = meta
	}
	return Code{s: s}
}
