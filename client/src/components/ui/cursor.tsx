type Props = {
  x: number;
  y: number;
  name: string;
  color: string;
};

export function Cursor({ x, y, name, color }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(2px, 2px)",
        pointerEvents: "none",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {/* Cursor SVG */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={color}
        stroke="white"
        strokeWidth="1"
        style={{
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
        }}
      >
        <path d="M3 2l7 18 2-6 6-2L3 2z" />
      </svg>

      {/* Name tag */}
      <div
        style={{
          backgroundColor: color,
          color: "white",
          fontSize: 11,
          padding: "2px 6px",
          borderRadius: 4,
          whiteSpace: "nowrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}
      >
        {name}
      </div>
    </div>
  );
}
