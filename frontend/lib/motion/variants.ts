import type { Variants } from "framer-motion";
import { motionTokens } from "./tokens";

export const fadeIn: Variants = {
  hidden: { opacity: motionTokens.opacity.hidden },
  visible: { 
    opacity: motionTokens.opacity.visible,
    transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease.out }
  },
  exit: {
    opacity: motionTokens.opacity.hidden,
    transition: { duration: motionTokens.duration.normal, ease: motionTokens.ease.in }
  }
};

export const slideUp: Variants = {
  hidden: { opacity: motionTokens.opacity.hidden, y: 20 },
  visible: { 
    opacity: motionTokens.opacity.visible, 
    y: 0,
    transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease.out }
  },
  exit: {
    opacity: motionTokens.opacity.hidden,
    y: -10,
    transition: { duration: motionTokens.duration.normal, ease: motionTokens.ease.in }
  }
};

export const slideInLeft: Variants = {
  hidden: { opacity: motionTokens.opacity.hidden, x: -20 },
  visible: { 
    opacity: motionTokens.opacity.visible, 
    x: 0,
    transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease.out }
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: motionTokens.opacity.hidden },
  visible: {
    opacity: motionTokens.opacity.visible,
    transition: {
      staggerChildren: motionTokens.stagger.normal,
      delayChildren: motionTokens.stagger.fast,
    },
  },
};

export const modalVariants: Variants = {
  hidden: { 
    opacity: motionTokens.opacity.hidden, 
    scale: 0.97,
    y: 8,
  },
  visible: { 
    opacity: motionTokens.opacity.visible, 
    scale: 1,
    y: 0,
    transition: { ...motionTokens.spring.soft }
  },
  exit: {
    opacity: motionTokens.opacity.hidden,
    scale: 0.97,
    y: 8,
    transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.in }
  }
};

export const scalePressVariants = {
  hover: { 
    scale: motionTokens.scale.hover,
    y: -1,
    transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.out }
  },
  tap: { 
    scale: motionTokens.scale.tap,
    y: 0,
    transition: { duration: motionTokens.duration.micro, ease: "easeOut" }
  }
};
