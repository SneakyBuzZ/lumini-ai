import { Copy, Edit2 } from "lucide-react";

interface UserChatProps {
  content: string;
  chatId: string;
}

export default function UserChat({ content, chatId }: UserChatProps) {
  return (
    <li key={chatId} className="list-none max-w-[70%] self-end group mt-4">
      <p className="text-[15px] whitespace-pre-wrap rounded-2xl p-2 bg-midnight-100/80 border border-midnight-100 shadow-sm px-4">
        {content}
      </p>
      <div className="flex justify-end py-1 gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <button className="h-[28px] w-[28px] p-2 flex justify-center items-center bg-midnight-100/50 border border-midnight-100/80 rounded-lg">
          <Copy className="size-4 cursor-pointer" />
        </button>
        <button className="h-[28px] w-[28px] p-2 flex justify-center items-center bg-midnight-100/50 border border-midnight-100/80 rounded-lg">
          <Edit2 className="size-4 cursor-pointer" />
        </button>
      </div>
    </li>
  );
}
