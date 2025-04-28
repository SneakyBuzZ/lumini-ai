import { registerSchema } from "@/lib/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SiGithub } from "react-icons/si";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import OrElement from "@/components/shared/or-element";
import { useLogin } from "@/lib/data/mutations/user.mutation";
import Spinner from "@/components/shared/spinner";
import { Link } from "react-router-dom";
import Logo from "@/components/shared/logo";

const LoginForm = () => {
  const { mutateAsync: login, isPending } = useLogin();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await login(values);
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed", error);
    }
  }

  return (
    <div className="relative w-1/3 flex flex-col justify-center items-center text-center gap-5 h-full px-14 bg-midnight-200 border-r border-r-neutral-900">
      <Logo withText className="absolute left-6 top-6" />
      <svg
        width="auto"
        height="auto"
        className="z-10 absolute -top-10 -left-10 blur-[120px]"
      >
        <circle cx="50" cy="50" r="80" fill="#616161" />
      </svg>

      <div className="z-50 relative flex flex-col justify-center items-center gap-6 w-full">
        <Button type="submit" variant={"outline"} className="w-full">
          <SiGithub />
          Continue with Github
        </Button>
      </div>
      <OrElement />
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
                      <Input placeholder="you@example.com" {...field} />
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
                <>Register</>
              )}
            </Button>
          </form>
        </Form>
      </div>
      <Link to="/auth/register">Register</Link>
      <Link to="/">Back</Link>
    </div>
  );
};

export default LoginForm;
