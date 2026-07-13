import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

/**
 * Drop-in <button> with smooth spring press animation via framer-motion.
 */
export const MotionButton = forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button">
>(function MotionButton({ children, ...props }, ref) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.6 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});
