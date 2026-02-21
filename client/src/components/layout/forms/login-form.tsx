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
import { useLogin } from "@/lib/api/mutations/user-mutations";
import { Route as LoginRoute } from "@/routes/auth/_pathlessLayout/login";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const { redirect } = LoginRoute.useSearch();
  const navigate = LoginRoute.useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
    navigate({
      to: redirect?.startsWith("/") ? redirect : "/dashboard",
      replace: true,
    });
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
                    <div className="flex items-center">
                      <Input
                        placeholder="··················"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="rounded-r-none"
                      />
                      <div
                        className="rounded-md rounded-l-none h-8 flex justify-center items-center px-3 bg-midnight-200 border border-midnight-100 cursor-pointer"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <Eye className="h-4 text-neutral-200" />
                        ) : (
                          <EyeOff className="h-4 text-neutral-400" />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          {error && (
            <p className="text-red-400 text-start text-sm w-full">{error}</p>
          )}
          <Button
            variant={"primary"}
            disabled={isPending}
            type="submit"
            className="w-full"
          >
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
