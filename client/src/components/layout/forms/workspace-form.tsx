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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleCheck } from "lucide-react";
import Spinner from "@/components/shared/spinner";
import { useState } from "react";
import { useCreateWorksace } from "@/lib/api/mutations/app-mutations";
import { useNavigate } from "@tanstack/react-router";

const workspaceSchema = z.object({
  name: z.string().min(2).max(100),
  plan: z.enum(["free", "pro", "enterprise"]),
  type: z.enum(["personal", "team"]),
});
type WorkspaceFormData = z.infer<typeof workspaceSchema>;

const WorkspaceForm = () => {
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createWorkspace, isPending } =
    useCreateWorksace(setError);

  const navigate = useNavigate();

  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "Workspace One",
      plan: "free",
      type: "personal",
    },
  });

  async function onSubmit(values: z.infer<typeof workspaceSchema>) {
    await createWorkspace(values);
    form.reset();
    navigate({ to: "/dashboard" });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 space-y-2 px-4 md:px-10 py-6 pb-10">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col sm:flex-row w-full justify-between items-start">
                <FormLabel className="text-xs sm:mt-4 w-40">Name</FormLabel>
                <div className="flex flex-col w-full lg:w-5/6 items-start gap-2">
                  <FormControl>
                    <Input
                      placeholder="Workspace Name"
                      {...field}
                      className="text-sm md:text-md"
                    />
                  </FormControl>
                  <FormDescription className=" text-xs md:px-2">
                    This is the name of your workspace.
                  </FormDescription>
                  <FormMessage className="px-2" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col sm:flex-row w-full justify-between items-start">
                <FormLabel className="text-xs sm:mt-4 w-40">Type</FormLabel>
                <div className="flex flex-col w-full lg:w-5/6 items-start gap-2">
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
                      {["personal", "team"].map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            {field.value === type && <CircleCheck size={12} />}
                            {type === "personal" && "Personal"}
                            {type === "team" && "Team"}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className=" text-xs md:px-2">
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
              <FormItem className="flex flex-col sm:flex-row w-full justify-between items-start">
                <FormLabel className="text-xs sm:mt-4 w-40">Plan</FormLabel>
                <div className="flex flex-col w-full lg:w-5/6 items-start gap-2">
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
                            {plan === "free" && "Free - ₹0/month"}
                            {plan === "pro" && "Pro - ₹500/month"}
                            {plan === "enterprise" &&
                              "Enterprise - ₹3000/month"}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className=" text-xs md:px-2">
                    This is the plan for your workspace.
                  </FormDescription>
                  <FormMessage>{error}</FormMessage>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full px-4 p-3 justify-between items-center gap-4 border-t">
          <div className="flex flex-1 items-center justify-end lg:justify-between gap-2">
            <span className="hidden sm:block text-xs text-neutral-400">
              You can change the plan later
            </span>
            <Button type="submit" variant={"primary"} className="h-8">
              {isPending ? (
                <>
                  Create Workspace
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
