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
import { Route } from "@/routes/dashboard/space/$slug/route";
import { useState } from "react";

interface InviteFormProps {
  setOpen: (open: boolean) => void;
}

const InviteForm = ({ setOpen }: InviteFormProps) => {
  const { slug } = Route.useParams();
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createInvite, isPending } = useCreateInvite(
    slug,
    setError,
  );
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  async function onSubmit(values: InviteFormValues) {
    await createInvite({ email: values.email, role: values.role });
    setOpen(false);
    window.location.reload();
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
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
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
              {error ? (
                <span className="text-sm text-red-500">{error}</span>
              ) : (
                <span className="text-sm text-neutral-500 w-full">
                  An invitation email will be sent to the provided address.
                </span>
              )}
            </div>
          </div>
          <div className="border-t w-full p-3 px-4 flex justify-end items-center">
            <Button disabled={isPending} type="submit" variant={"primary"}>
              Send Invite
              {isPending && <Spinner />}
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
  role: z.enum(["member", "admin", "owner"], {
    required_error: "Role is required",
  }),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default InviteForm;
