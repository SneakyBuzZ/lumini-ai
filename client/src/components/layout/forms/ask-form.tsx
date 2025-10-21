import { Globe, SendHorizontal, Square, SquarePlus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { askQuery } from "@/lib/api/lab-api";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/utils/cn.util";
import { LabChat } from "@/lib/types/lab-type";
import useAuthStore from "@/lib/store/auth-store";

const askSchema = z.object({
  query: z.string().min(1, "Question is required"),
});

interface AskFormProps {
  setChats: React.Dispatch<React.SetStateAction<LabChat[]>>;
  isStreaming: boolean;
  setStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  sessionId: string;
  className?: string;
}

const AskForm = ({
  className,
  setChats,
  isStreaming,
  setStreaming,
  sessionId,
}: AskFormProps) => {
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const form = useForm<z.infer<typeof askSchema>>({
    resolver: zodResolver(askSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof askSchema>) {
    const query = values.query.trim();
    form.reset();
    if (!user) return;
    const labId = pathname.split("/").at(-2);
    if (!labId) return;
    setChats((prev) => {
      const newChat: LabChat = {
        id: String(Date.now()),
        userId: user.id,
        sessionId: sessionId,
        role: "user",
        content: query,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return [...prev, newChat];
    });
    const response = await askQuery(query, labId);
    setStreaming(true);
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        setChats((prev) => {
          const updatedChats = [...prev];
          const lastChat = updatedChats[updatedChats.length - 1];
          if (lastChat && lastChat.role === "assistant") {
            lastChat.content += decoder.decode(value);
          } else {
            updatedChats.push({
              id: String(Date.now()),
              userId: null,
              sessionId: sessionId,
              role: "assistant",
              content: decoder.decode(value),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          return updatedChats;
        });
      }
    }
    setStreaming(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "w-full flex flex-col justify-start items-start gap-2 p-3 border bg-midnight-200/95 backdrop-blur-md border-neutral-800/50 rounded-2xl shadow-md",
          className
        )}
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  className="shadow-none border-none w-full resize-none p-1"
                  placeholder="Ask anything"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start items-center gap-3">
            <Button
              variant={"outline"}
              className="flex justify-center items-center bg-midnight-200 border-neutral-800/50"
            >
              <SquarePlus color="#737373" size={15} />
              <span className="text-sm text-neutral-600">Add File</span>
            </Button>
            <Button
              variant={"outline"}
              className="flex justify-center items-center bg-midnight-200 border-neutral-800/50"
            >
              <Globe color="#737373" size={15} />
              <span className="text-sm text-neutral-600">Search Web</span>
            </Button>
          </div>
          <Button variant={"secondary"} type="submit" className="w-10">
            {isStreaming ? (
              <Square className="bg-white rounded-sm" />
            ) : (
              <SendHorizontal className="-rotate-45" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AskForm;
