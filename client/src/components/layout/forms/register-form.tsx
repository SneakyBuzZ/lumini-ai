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
import { useRegister } from "@/api/mutations/user-mutations";

const RegisterForm = () => {
  const { mutateAsync: register, isPending } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    await register(values);
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
                    <Input placeholder="**********" {...field} />
                  </FormControl>
                  <FormMessage />
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
  );
};

const registerSchema = z.object({
  name: z.string().min(2).max(100, {
    message: "Name must be between 2 and 100 characters",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default RegisterForm;
