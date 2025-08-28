import React from "react";
import { motion } from "framer-motion";

/**
 * Token component displaying a colored circular token at specified board position, 
 * animated on movement and selectable state.
 *
 * Props:
 * - position: { row: number, col: number } - grid coordinates of token
 * - color: string - token color (CSS color)
 * - isSelected: boolean - whether token is selected for possible move (animated)
 * - onClick: function - callback when token clicked
 */
export default function Token({ position, color, isSelected, onClick }) {
  const top = position ? position.row * 48 + 4 : 0;
  const left = position ? position.col * 48 + 4 : 0;

  return (
    <motion.div
      onClick={onClick}
      layout
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick && onClick();
        }
      }}
      initial={{ scale: 0.8 }}
      animate={{ scale: isSelected ? 1.2 : 1, top, left }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        position: "absolute",
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: color,
        border: isSelected ? "3px solid gold" : "2px solid black",
        cursor: "pointer",
        zIndex: isSelected ? 20 : 10,
        boxShadow: "0 0 8px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
      aria-label={`Token at row ${position?.row}, column ${position?.col}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }} 
    />
  );
}
