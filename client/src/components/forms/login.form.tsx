import { registerSchema } from "@/lib/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SiGoogle, SiGithub } from "react-icons/si";

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
    <div className="w-[550px] flex flex-col justify-center items-center text-center gap-8 h-full px-10">
      <div className="relative w-[90%] flex flex-col justify-center items-center gap-6">
        <Button type="submit" variant={"outline"} className="w-full ">
          <SiGoogle />
          Continue with Google
        </Button>

        <Button type="submit" className="w-full">
          <SiGithub />
          Continue with Github
        </Button>
      </div>
      <OrElement />
      <div className="flex w-[90%] flex-col justify-center items-center gap-6">
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
