import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/spinner";

interface ChangeEmailFormProps {
  email: string;
}

export default function ChangeEmailForm({ email }: ChangeEmailFormProps) {
  const [error] = useState<string | null>(null);
  const isPending = false;

  const form = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: email,
      confirmEmail: "",
    },
  });

  async function onSubmit(values: ChangeEmailFormValues) {
    console.log(values);
  }
  return (
    <div className="flex w-full flex-col justify-center items-center gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Email</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && !isPending && (
            <p className="w-full text-red-400 text-start text-sm">{error}</p>
          )}
          <Button
            disabled={true}
            type="submit"
            variant={"secondary"}
            className="w-full"
          >
            {isPending ? (
              <>
                Updating Email
                <Spinner color="#ffff" />
              </>
            ) : (
              <>Feature in Development</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

const changeEmailSchema = z
  .object({
    email: z.string().email({
      message: "Invalid email address",
    }),
    confirmEmail: z.string().email({
      message: "Invalid email address",
    }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails do not match",
    path: ["confirmEmail"],
  });

type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;
