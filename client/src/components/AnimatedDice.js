import React, { useState, useEffect } from "react";

/**
 * Animated dice component.
 *
 * Props:
 * - rollValue: number|null - current rolled dice value or null if none
 * - onRoll: function - callback to trigger dice roll when clicked
 * - rolling: boolean - whether dice is currently rolling (animated)
 * - disabled: boolean - disables click interaction when true
 */
export default function AnimatedDice({ rollValue, onRoll, rolling, disabled }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (rolling) {
      setAnimating(true);
    } else {
      const timer = setTimeout(() => setAnimating(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [rolling]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !disabled && !rolling && onRoll && onRoll()}
      onKeyDown={(e) => {
        if (!disabled && !rolling && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onRoll && onRoll();
        }
      }}
      aria-label="Roll Dice"
      style={{
        width: 64,
        height: 64,
        borderRadius: 12,
        border: "3px solid #222",
        background: "#fff",
        userSelect: "none",
        cursor: disabled || rolling ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 36,
        fontWeight: "bold",
        margin: "12px auto",
        boxShadow: animating ? "0 0 10px 4px orange" : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {animating ? "🎲" : rollValue ?? "-"}
      <style>{`
        div[role="button"]:focus {
          outline: 3px solid #ffa500;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
