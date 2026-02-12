import { useEffect, useRef, useState } from "react";
import AssistantChat from "@/components/_lab/ask/assistant-chat";
import UserChat from "@/components/_lab/ask/user-chat";
import { LabChat } from "@/lib/types/lab-type";
import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { getAIConfig, getLabChats, getSessionId } from "@/lib/api/lab-api";
import AskForm from "@/components/layout/forms/ask-form";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/lab/$slug/ask")({
  loader: async ({ params }) => {
    const labSlug = params.slug;

    const configData = await getAIConfig(labSlug);
    if (!configData.isConfigured) {
      return {
        sessionId: null,
        initialChats: [],
        loaderError: "AI features are not configured for this lab",
        isConfigured: false,
      };
    }

    try {
      const sessionId = await getSessionId(labSlug);
      const chats = await getLabChats(sessionId);

      return {
        sessionId,
        initialChats: chats,
        loaderError: null,
        isConfigured: true,
      };
    } catch (error) {
      console.error("Loader failed:", error);

      return {
        sessionId: null,
        initialChats: [],
        loaderError: "AI service is currently unavailable",
        isConfigured: true,
      };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId, initialChats, loaderError, isConfigured } = useLoaderData({
    from: Route.id,
  });
  const [chats, setChats] = useState<LabChat[]>(initialChats || []);
  const [initialMount, setInitialMount] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const hasShownError = useRef(false);
  const { slug } = Route.useParams();

  useEffect(() => {
    if (loaderError && !hasShownError.current) {
      toast(loaderError);
      hasShownError.current = true;
    }
  }, [loaderError]);

  useEffect(() => {
    if (!isStreaming && endRef.current) {
      const behavior = initialMount ? "instant" : "smooth";
      endRef.current.scrollIntoView({ behavior });
      setInitialMount(false);
    }
  }, [chats, initialMount, isStreaming]);

  if (chats.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-midnight-300/70 px-5 lg:px-10 xl:px-[14rem]">
        <h2
          className={`text-2xl font-semibold text-center mb-4 ${isConfigured && "-translate-y-10"}`}
        >
          Ask anything to Lumini AI
        </h2>
        <AskForm
          className={`mb-2 ${isConfigured && "-translate-y-10"}`}
          setChats={setChats}
          setStreaming={setIsStreaming}
          sessionId={sessionId}
          isStreaming={isStreaming}
          isError={!!loaderError}
        />
        {!isConfigured && (
          <div
            className={`w-full flex items-center justify-between bg-midnight-100/80 border border-neutral-800  rounded-xl px-4 py-2 `}
          >
            <span>AI features are not configured for this lab.</span>
            <Link
              to="/dashboard/lab/$slug/settings"
              params={{ slug }}
              hash="ai-configuration"
              className="text-sm text-neutral-200 hover:underline underline-offset-2"
            >
              Configure AI
            </Link>
          </div>
        )}
      </div>
    );
  }

  const showLoading = isStreaming && chats[chats.length - 1].role === "user";

  return (
    <div className="relative w-full flex flex-col justify-start items-center bg-midnight-300/70 h-full">
      <ul
        className="w-full flex-1 flex flex-col justify-start overflow-y-auto py-4 pb-56 px-5 lg:px-10 xl:px-[14rem]"
        style={{ overflowAnchor: "none" }}
      >
        {chats.map((chat) =>
          chat.role === "user" ? (
            <UserChat key={chat.id} chatId={chat.id} content={chat.content} />
          ) : (
            <AssistantChat
              key={chat.id}
              chatId={chat.id}
              content={chat.content}
            />
          ),
        )}
        {showLoading && (
          <div className="flex items-center gap-2 mt-4 text-midnight-500 self-start">
            <Sparkles className="size-4" />
            <TextShimmer>Lumini AI is typing your response...</TextShimmer>
          </div>
        )}
        <div ref={endRef} />
      </ul>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="px-5 lg:px-10 xl:px-[14rem]">
          <div className="w-full bg-midnight-300 pb-2 rounded-t-3xl flex flex-col justify-center">
            <AskForm
              setChats={setChats}
              setStreaming={setIsStreaming}
              sessionId={sessionId}
              isStreaming={isStreaming}
            />
            <span className="w-full text-xs text-center tracking-tight text-neutral-600 pt-2">
              Lumini AI can make mistakes. Please verify the information
              provided.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
