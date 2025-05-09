import { useEffect } from "react";
import useCanvasStore from "@/lib/store/canvas.store";
import { renderShapes } from "@/lib/canvas/drawing";
import { initialiseCanvas } from "@/lib/canvas/utils";
import UseCanvas from "@/hooks/use-canvas";

export function Canvas() {
  const {
    canvasRef,
    handleDoubleClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    editingText,
    setEditingText,
  } = UseCanvas();

  const { shapes, addShape } = useCanvasStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    initialiseCanvas(ctx, canvas);
    renderShapes(shapes, ctx);
  }, [shapes, canvasRef]);

  return (
    <div className="relative w-full flex-1 flex justify-center items-center">
      <canvas
        ref={canvasRef}
        className="bg-midnight-400 w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />
      {editingText && (
        <textarea
          autoFocus
          style={{
            position: "absolute",
            top: editingText.y,
            left: editingText.x,
            fontSize: "16px",
            fontFamily: "sans-serif",
            zIndex: 10,
            background: "transparent",
            color: "#ffff",
          }}
          className="bg-midnight-400 text-white border-none outline-none resize-none"
          value={editingText.value}
          onChange={(e) =>
            setEditingText({ ...editingText, value: e.target.value })
          }
          onBlur={() => {
            if (editingText.value.trim()) {
              addShape({
                id: crypto.randomUUID(),
                type: "text",
                x: editingText.x,
                y: editingText.y,
                width: 0,
                height: 0,
                color: "#fff",
                text: editingText.value,
              });
            }
            setEditingText(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).blur();
            }
          }}
        />
      )}
    </div>
  );
}
