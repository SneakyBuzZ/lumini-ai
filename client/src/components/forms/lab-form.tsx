import { labSchema } from "@/lib/schemas/lab-schema";
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
import { DialogClose } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useWorkspacesStore from "@/lib/store/workspace-store";
import { useCreateLab } from "@/lib/data/mutations/lab-mutations";
import { toast } from "sonner";
import Spinner from "../shared/spinner";

const LabForm = () => {
  const { workspaces, currentWorkspace } = useWorkspacesStore();
  const { mutateAsync: createLab, isPending } = useCreateLab();
  const form = useForm<z.infer<typeof labSchema>>({
    resolver: zodResolver(labSchema),
    defaultValues: {
      name: "",
      githubUrl: "",
      workspaceId: currentWorkspace?.id,
    },
  });

  async function onSubmit(values: z.infer<typeof labSchema>) {
    const status = await createLab(values);
    form.reset();
    if (status === 200) {
      toast.success("Lab created successfully");
    } else if (status === 204) {
      toast.error("Limit reached, please upgrade your plan");
    } else {
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 space-y-2 px-10 pt-4 pb-10">
          <FormField
            control={form.control}
            name="workspaceId"
            render={({ field }) => (
              <FormItem className="flex w-full justify-between items-start">
                <FormLabel className="mt-4">Workspace</FormLabel>
                <div className="flex flex-col w-5/6 items-start gap-2">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a workspace" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workspaces &&
                        workspaces.length > 0 &&
                        workspaces.map((workspace) => (
                          <SelectItem key={workspace.id} value={workspace.id}>
                            {workspace.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="px-2">
                    This is the plan for your workspace.
                  </FormDescription>
                  <FormMessage className="px-2" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full justify-between items-start">
                <FormLabel className="mt-4">Name</FormLabel>
                <div className="flex flex-col w-5/6 items-start gap-2">
                  <FormControl>
                    <Input placeholder="Lab Name" {...field} />
                  </FormControl>
                  <FormDescription className="px-2">
                    This is the name of your lab.
                  </FormDescription>
                  <FormMessage className="px-2" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem className="flex w-full justify-between items-start">
                <FormLabel className="mt-4">GitHub URL</FormLabel>
                <div className="flex flex-col w-5/6 items-start gap-2">
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="px-2">
                    This is the URL of your GitHub repository.
                  </FormDescription>
                  <FormMessage className="px-2" />
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full px-4 p-3 justify-between items-center gap-4 border-t">
          <DialogClose className="p-3 h-8 bg-neutral-900 text-sm flex justify-center items-center rounded-md border border-neutral-800 text-neutral-400 hover:bg-neutral-800 transition-colors">
            Cancel
          </DialogClose>
          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="text-xs text-neutral-400">
              You can change the rename later
            </span>
            <Button type="submit" className="h-8">
              {isPending ? <Spinner /> : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LabForm;
