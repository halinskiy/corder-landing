import type { Transition } from "framer-motion";

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const enterFromBelow: Transition = {
  duration: 0.4,
  ease: EASE_OUT,
};

export const blurReveal: Transition = {
  duration: 0.6,
  ease: EASE_OUT,
};
