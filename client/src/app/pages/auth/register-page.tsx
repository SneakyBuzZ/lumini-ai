import RegisterForm from "@/components/forms/register-form";

const RegisterPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <RegisterForm />
      <div className="flex flex-1">LOGIN</div>
    </div>
  );
};

export default RegisterPage;
