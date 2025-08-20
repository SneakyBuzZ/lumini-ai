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
import { useState } from "react";
import { useLogin } from "@/api/mutations/user-mutations";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: login, isPending } = useLogin(setError);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await login(values);
  }

  return (
    <div className="z-50 flex w-full flex-col justify-center items-center gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col">
                  <FormLabel className="text-start">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@mail.com" {...field} />
                  </FormControl>
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col">
                  <FormLabel className="text-start">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="**********" {...field} />
                  </FormControl>
                  <FormMessage>{error}</FormMessage>
                </FormItem>
              </>
            )}
          />
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <>
                <Spinner color="#ffff" />
                Loading
              </>
            ) : (
              <>Login</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default LoginForm;
