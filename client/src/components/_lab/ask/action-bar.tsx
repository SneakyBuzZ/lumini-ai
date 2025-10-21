import { Copy, Edit2, ThumbsDown, ThumbsUp, Upload } from "lucide-react";

export default function ActionBar() {
  return (
    <div className="flex justify-end py-1 gap-1">
      <button className="h-[28px] w-[28px] p-2 flex justify-center items-center bg-midnight-100/50 border border-midnight-100/80 rounded-lg">
        <Copy className="size-4 cursor-pointer" />
      </button>
      <button className="h-[28px] w-[28px] p-2 flex justify-center items-center bg-midnight-100/50 border border-midnight-100/80 rounded-lg">
        <ThumbsUp className="size-4 cursor-pointer" />
      </button>
      <button className="h-[28px] w-[28px] p-2 flex justify-center items-center bg-midnight-100/50 border border-midnight-100/80 rounded-lg">
        <ThumbsDown className="size-4 cursor-pointer" />
      </button>
      <button className="h-[28px] w-[28px] p-2 flex justify-center items-center bg-midnight-100/50 border border-midnight-100/80 rounded-lg">
        <Upload className="size-4 cursor-pointer" />
      </button>
      <button className="h-[28px] w-[28px] p-2 flex justify-center items-center bg-midnight-100/50 border border-midnight-100/80 rounded-lg">
        <Edit2 className="size-4 cursor-pointer" />
      </button>
    </div>
  );
}
