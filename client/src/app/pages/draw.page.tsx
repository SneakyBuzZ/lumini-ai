import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

export default function Whiteboard() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Tldraw className="tldraw__editor--dark" />{" "}
      {/* Apply custom dark theme class */}
    </div>
  );
}
