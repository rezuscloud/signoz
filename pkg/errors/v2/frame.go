package v2

import (
	"runtime"
	"sync"
)

// Frame is a single line in the call stack. Frames[0] is the constructor's
// caller — the authoritative "where this error came from" — and downstream
// consumers can filter (e.g. "frames inside our code") without regex
// reparsing of a pre-formatted stack string.
type Frame struct {
	Func string `json:"func,omitempty"`
	File string `json:"file,omitempty"`
	Line int    `json:"line,omitempty"`
}

// frameStack carries the PCs captured at construction plus the resolved
// []Frame slice, behind a sync.Once. Resolving frames into func/file/line is
// expensive (runtime.CallersFrames walks the symbol table); the vast majority
// of errors are constructed and never inspected, so we only pay that cost
// when a consumer actually asks for frames (Frames()/MarshalJSON/%+v).
//
// The PC capture itself is cheap and happens at construction so that
// Frames[0] is a faithful "where" record of the original call site.
type frameStack struct {
	pcs []uintptr

	once     sync.Once
	resolved []Frame
}

// captureStack is called by every constructor. skip drops runtime.Callers,
// captureStack itself, and the constructor frame so that the first PC is the
// user code that invoked the constructor.
func captureStack(skip int) *frameStack {
	const depth = 32
	pcs := make([]uintptr, depth)
	n := runtime.Callers(skip, pcs)
	if n == 0 {
		return nil
	}
	return &frameStack{pcs: pcs[:n:n]}
}

// frames resolves the captured PCs into []Frame. The resolution is memoized
// — concurrent calls are safe and only one of them does the work.
func (s *frameStack) frames() []Frame {
	if s == nil {
		return nil
	}
	s.once.Do(func() {
		cf := runtime.CallersFrames(s.pcs)
		out := make([]Frame, 0, len(s.pcs))
		for {
			f, more := cf.Next()
			out = append(out, Frame{Func: f.Function, File: f.File, Line: f.Line})
			if !more {
				break
			}
		}
		s.resolved = out
	})
	return s.resolved
}
