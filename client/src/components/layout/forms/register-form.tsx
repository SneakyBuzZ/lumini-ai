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
import { useRegister } from "@/lib/api/mutations/user-mutations";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Route as RegisterRoute } from "@/routes/auth/_pathlessLayout/register";

const RegisterForm = () => {
  const { token } = RegisterRoute.useSearch();
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: register, isPending } = useRegister(setError);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    await register({
      ...values,
      inviteToken: token,
    });

    if (token) {
      navigate({ to: "/dashboard" });
      return;
    }

    toast("Registration successful! Please verify your email.");
    navigate({
      to: "/auth/verify",
      search: { email: values.email },
    });
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
            name="name"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col">
                  <FormLabel className="text-start">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                </FormItem>
              </>
            )}
          />
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
                  <FormMessage />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col">
                  <FormLabel className="text-start">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="··················"
                      {...field}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          {error && !isPending && (
            <p className="w-full text-red-400 text-start text-sm">{error}</p>
          )}
          <Button
            disabled={isPending}
            type="submit"
            variant={"secondary"}
            className="w-full"
          >
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
  );
};

const registerSchema = z
  .object({
    name: z.string().min(2).max(100, {
      message: "Name must be between 2 and 100 characters",
    }),
    email: z.string().email({
      message: "Invalid email address",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default RegisterForm;
