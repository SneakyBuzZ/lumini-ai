import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/shared/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInvite } from "@/lib/api/mutations/app-mutations";
import { useLocation } from "@tanstack/react-router";
import { useState } from "react";

const InviteForm = () => {
  const { pathname } = useLocation();
  const [error, setError] = useState<string | null>(null);
  const workspaceId = pathname.split("/")[3];
  const { mutateAsync: createInvite, isPending } = useCreateInvite(
    workspaceId,
    setError
  );
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "developer",
    },
  });

  async function onSubmit(values: InviteFormValues) {
    await createInvite({ email: values.email, role: values.role });
  }

  return (
    <div className="flex w-full flex-col justify-center items-center gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
        >
          <div className="space-y-4 px-4 pt-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <>
                  <FormItem className="flex flex-col ">
                    <FormLabel className="text-start">Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="p-1 w-[var(--radix-select-trigger-width)]">
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="administrator">
                            Administrator
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-start">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <p className="text-sm text-neutral-500 w-full">
                An invitation email will be sent to the provided address.
              </p>
              {error && <div className="text-sm text-red-500">{error}</div>}
            </div>
          </div>
          <div className="border-t w-full p-4 py-3">
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? (
                <>
                  <Spinner color="#ffff" />
                  Loading
                </>
              ) : (
                <>Send Invitation</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const inviteSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  role: z.enum(["developer", "owner", "adminstrator"], {
    required_error: "Role is required",
  }),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default InviteForm;
