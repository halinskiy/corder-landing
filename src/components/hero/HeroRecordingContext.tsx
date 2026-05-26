"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Shared recording state for the Hero block. Drives BOTH the
 * headline "Record" widget AND the HeroLibraryDemo recording
 * banner so the two stay in lockstep -- when the headline word
 * turns red, the demo banner appears; when the headline goes back
 * to rest, the demo flips to transcript.
 *
 * One auto-cycle lives here (5s warm-up -> 3s recording -> 7s
 * rest -> loop). Click handlers in the headline OR demo call
 * `toggle()` to flip immediately; the next phase timer fires off
 * the new state, so the cycle never restarts at 0 -- it just
 * resumes from the new state.
 */
type Ctx = {
  /** True while the rec widget is in its "recording" state. */
  recording: boolean;
  /** Flip the state immediately. Resets the auto-cycle timer to
   *  the new state's duration. */
  toggle: () => void;
  /** Imperative setter. Used by demo "Stop recording" /
   *  "Restart recording" buttons. */
  setRecording: (value: boolean) => void;
};

const HeroRecordingContext = createContext<Ctx | null>(null);

const WARM_UP_MS = 3_500;
// Bumped 3s -> 10s on 2026-05-26 (maker request). The previous 3s
// felt rushed -- viewers barely registered the red rec pill before
// the demo flipped back to the transcript surface. 10s gives enough
// dwell time to read "Recording 00:0x Stop recording" and watch the
// rec blob breathe before transcription kicks in.
const RECORDING_MS = 10_000;
const REST_MS = 7_000;

export function HeroRecordingProvider({ children }: { children: ReactNode }) {
  const [recording, setRecording] = useState(false);
  const warmedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const toggle = useCallback(() => {
    setRecording((prev) => !prev);
  }, []);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const delay = warmedRef.current
      ? recording
        ? RECORDING_MS
        : REST_MS
      : WARM_UP_MS;
    warmedRef.current = true;
    timerRef.current = window.setTimeout(toggle, delay);
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [recording, toggle]);

  return (
    <HeroRecordingContext.Provider value={{ recording, toggle, setRecording }}>
      {children}
    </HeroRecordingContext.Provider>
  );
}

export function useHeroRecording(): Ctx {
  const ctx = useContext(HeroRecordingContext);
  if (!ctx) {
    // Soft fallback so the demo + headline still render when
    // pulled into isolation (storybook, tests, etc).
    return {
      recording: false,
      toggle: () => {},
      setRecording: () => {},
    };
  }
  return ctx;
}
