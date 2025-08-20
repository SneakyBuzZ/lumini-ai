import { Globe, SquarePlus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { askSchema } from "@/lib/schemas/ask-schema";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getAnswer } from "@/api/lab-api";
import useLabStore from "@/lib/store/lab-store";
import useAnswerStore from "@/lib/store/asnwer-store";

const AskForm = () => {
  const { lab } = useLabStore();
  const { addAnswer } = useAnswerStore();

  const form = useForm<z.infer<typeof askSchema>>({
    resolver: zodResolver(askSchema),
    defaultValues: {
      question: "",
    },
  });

  async function onSubmit(values: z.infer<typeof askSchema>) {
    const response = await getAnswer(values.question, lab!.id);
    if (!response) {
      console.log("No response received from the server.");
      return;
    }
    addAnswer(response);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col justify-start items-start gap-4 border p-4 bg-midnight-300 rounded-md border-midnight-100/50"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  className="shadow-none border-none bg-transparent w-full resize-none"
                  placeholder="Ask your repository..."
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center p-2 mt-10 w-full">
          <div className="flex justify-start items-center gap-3">
            <div className="flex justify-center items-center">
              <SquarePlus color="#737373" size={15} />
              <span className="text-sm text-neutral-600 ml-2">Add File</span>
            </div>
            <div className="flex justify-center items-center">
              <Globe color="#737373" size={15} />
              <span className="text-sm text-neutral-600 ml-2">Search Web</span>
            </div>
          </div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default AskForm;
