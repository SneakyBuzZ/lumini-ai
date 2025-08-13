import { registerSchema } from "@/lib/schemas/register-schema";
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
import { useLogin } from "@/lib/data/mutations/user-mutations";
import Spinner from "@/components/shared/spinner";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/shared/logo";
import { ChevronLeft } from "lucide-react";

const LoginForm = () => {
  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();

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
    <div className="w-1/3 flex flex-col justify-start items-center text-center gap-5 px-5 h-full bg-midnight-300 border-r border-r-neutral-900">
      <div className="flex h-20 w-full justify-between items-center">
        <Logo withText />
        <Button variant={"link"} onClick={() => navigate("/")}>
          <ChevronLeft />
          Back
        </Button>
      </div>

      <div className="flex flex-1 flex-col justify-center items-center gap-2 px-10">
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
        <span>
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-teal">
            Register
          </Link>
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
