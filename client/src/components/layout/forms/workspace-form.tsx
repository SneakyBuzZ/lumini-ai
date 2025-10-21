import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleCheck } from "lucide-react";
import Spinner from "@/components/shared/spinner";
import { useRef, useState } from "react";
import { useCreateWorksace } from "@/lib/api/mutations/app-mutations";

const workspaceSchema = z.object({
  name: z.string().min(2).max(100),
  plan: z.enum(["free", "pro", "enterprise"]),
});

const WorkspaceForm = () => {
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createWorkspace, isPending } =
    useCreateWorksace(setError);
  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      plan: "free",
    },
  });

  const closeRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof workspaceSchema>) {
    await createWorkspace(values);
    form.reset();
    closeRef.current?.click();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 space-y-2 px-10 pt-4 pb-10">
          {" "}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full justify-between items-start">
                <FormLabel className="mt-4">Name</FormLabel>
                <div className="flex flex-col w-5/6 items-start gap-2">
                  <FormControl>
                    <Input placeholder="Workspace Name" {...field} />
                  </FormControl>
                  <FormDescription className="px-2">
                    This is the name of your workspace.
                  </FormDescription>
                  <FormMessage className="px-2" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem className="flex w-full justify-between items-start">
                <FormLabel className="mt-4">Plan</FormLabel>
                <div className="flex flex-col w-5/6 items-start gap-2">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["free", "pro", "enterprise"].map((plan) => (
                        <SelectItem key={plan} value={plan}>
                          <div className="flex items-center gap-2">
                            {field.value === plan && <CircleCheck size={12} />}
                            {plan === "free" && "Free - $0/month"}
                            {plan === "pro" && "Pro - $10/month"}
                            {plan === "enterprise" && "Enterprise - $30/month"}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="px-2">
                    This is the plan for your workspace.
                  </FormDescription>
                  <FormMessage>{error}</FormMessage>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full px-4 p-3 justify-between items-center gap-4 border-t">
          <DialogClose
            ref={closeRef}
            className="p-3 h-8 bg-neutral-900 text-sm flex justify-center items-center rounded-md border border-neutral-800 text-neutral-400 hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </DialogClose>
          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="text-xs text-neutral-400">
              You can change the plan later
            </span>
            <Button type="submit" className="h-8">
              {isPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                "Create Workspace"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default WorkspaceForm;
