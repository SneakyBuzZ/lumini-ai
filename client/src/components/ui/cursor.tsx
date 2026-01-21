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
        transform: "translate(4px, 4px)",
        pointerEvents: "none",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 6,
        color, // 👈 drives SVG via currentColor
      }}
    >
      {/* Cursor SVG */}
      {/* <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        style={{
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.45))",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 4,20 C 3,19 3,17 4,15 C 5,13 6,12 8,11 C 10,10 12,10 14,11 C 16,12 17,13 18,15 C 19,17 19,19 18,20 C 16,21 12,21 8,20 C 6,20 4,20 4,20 Z M 7,18 C 6,18 6,17 7,16 C 8,15 9,15 10,16 C 11,17 11,18 10,19 C 9,20 8,19 7,18 Z"
          fill="none"
          stroke="white"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M 4,20 C 3,19 3,17 4,15 C 5,13 6,12 8,11 C 10,10 12,10 14,11 C 16,12 17,13 18,15 C 19,17 19,19 18,20 C 16,21 12,21 8,20 C 6,20 4,20 4,20 Z M 7,18 C 6,18 6,17 7,16 C 8,15 9,15 10,16 C 11,17 11,18 10,19 C 9,20 8,19 7,18 Z"
          fill="currentColor"
        />
      </svg> */}

      <svg
        width="15"
        height="15"
        viewBox="-10 -10 230 235"
        style={{
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.45))",
          overflow: "visible",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* OUTLINE */}
        <path
          d="M82.6963 209.235C78.3489 217.007 66.8325 215.89 64.0608 207.426L0.529449 13.4311C-2.2463 4.95531 6.40497 -2.76157 14.5099 0.960706L203.962 87.9691C212.256 91.7783 211.78 103.722 203.208 106.858L127.245 134.65C124.948 135.491 123.029 137.126 121.836 139.26L82.6963 209.235Z"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* FILL */}
        <path
          d="M82.6963 209.235C78.3489 217.007 66.8325 215.89 64.0608 207.426L0.529449 13.4311C-2.2463 4.95531 6.40497 -2.76157 14.5099 0.960706L203.962 87.9691C212.256 91.7783 211.78 103.722 203.208 106.858L127.245 134.65C124.948 135.491 123.029 137.126 121.836 139.26L82.6963 209.235Z"
          fill="currentColor"
        />
      </svg>

      {/* Name tag */}
      <div
        style={{
          backgroundColor: color,
          color: "white",
          fontSize: 10,
          padding: "1.5px 6px",
          borderRadius: 5,
          whiteSpace: "nowrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.45)",
        }}
      >
        {name}
      </div>
    </div>
  );
}
