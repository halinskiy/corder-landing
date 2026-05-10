import type { Variants, Transition } from "framer-motion";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_MINIMIZE = [0.4, 0, 0.2, 1] as const;

export const durations = {
  micro: 0.15,
  menu: 0.15,
  modal: 0.2,
  section: 0.4,
} as const;

const defaultTransition: Transition = {
  duration: durations.section,
  ease: EASE_OUT,
};

export const motionPresets = {
  enterFromBelow: {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: defaultTransition,
  },
  enterFromAbove: {
    initial: { opacity: 0, y: -24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: defaultTransition,
  },
  blurReveal: {
    initial: { opacity: 0, filter: "blur(12px)" },
    whileInView: { opacity: 1, filter: "blur(0px)" },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 0.6, ease: EASE_OUT },
  },
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-10%" },
    transition: defaultTransition,
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-10%" },
    transition: defaultTransition,
  },
  staggerChildren: (delay = 0.04): Variants => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: delay, delayChildren: 0.1 },
    },
  }),
} as const;
