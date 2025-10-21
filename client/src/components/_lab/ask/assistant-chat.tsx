import { MDXProvider } from "@mdx-js/react";
import MarkdownRenderer from "@/components/md/md-renderer";
import { components } from "@/components/md/md-html";

interface AssistantChatProps {
  content: string;
  chatId: string;
}

export default function AssistantChat({ content, chatId }: AssistantChatProps) {
  const MDContent = () => {
    return <MarkdownRenderer content={content} />;
  };

  return (
    <li key={chatId} className="list-none rounded-2xl w-full self-start mb-8">
      <MDXProvider components={components}>
        <MDContent />
      </MDXProvider>
    </li>
  );
}
