import * as React from "react";
import { cn } from "@/utils/cn.util";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, onChange, value, ...props }, forwardedRef) => {
  // Use a function ref to access the DOM element for measurement
  const [localNode, setLocalNode] = React.useState<HTMLTextAreaElement | null>(
    null
  );

  // Combine the forwarded ref and the local ref
  const ref = React.useCallback(
    (node: HTMLTextAreaElement) => {
      // Set the local node state
      setLocalNode(node);

      // Also set the forwarded ref if it exists
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  // State to hold the current value of the textarea
  const [currentValue, setCurrentValue] = React.useState(value || "");

  // Effect to adjust height when content changes
  React.useEffect(() => {
    if (localNode) {
      // Reset height to 'auto' to correctly calculate the scrollHeight
      localNode.style.height = "auto";
      // Set the height to the scrollHeight
      localNode.style.height = `${localNode.scrollHeight}px`;
    }
  }, [currentValue, localNode]); // Re-run this effect whenever currentValue or localNode changes

  // Handle changes to the textarea
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentValue(event.target.value);
    // Call the original onChange prop if it was provided
    if (onChange) {
      onChange(event);
    }
  };

  // If the `value` prop changes from the parent, update our internal state
  React.useEffect(() => {
    if (value !== undefined && value !== currentValue) {
      setCurrentValue(value);
    }
  }, [value]);

  return (
    <textarea
      spellCheck="false"
      className={cn(
        "flex min-h-[40px] max-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      value={currentValue}
      onChange={handleChange}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
