import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function IconAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.04 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="group flex flex-col items-center gap-1 rounded-2xl bg-secondary/60 py-3 text-secondary-foreground hover:bg-secondary hover:shadow-soft"
    >
      <motion.span
        whileHover={{ scale: 1.15, rotate: 4 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
      >
        {icon}
      </motion.span>
      <span className="text-[11px] font-medium">{label}</span>
    </motion.button>
  );
}
