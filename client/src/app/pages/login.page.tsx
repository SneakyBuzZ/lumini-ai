import LoginForm from "@/components/forms/login.form";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <LoginForm />
      <div className="flex flex-1 flex-col justify-center items-center bg-midnight-400 h-full">
        <h1 className="text-4xl font-bold text-white">
          Welcome back to Lumini
        </h1>
        <p className="text-lg text-gray-400">
          Unlock your workspaces. Search your repos. Ship faster.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
