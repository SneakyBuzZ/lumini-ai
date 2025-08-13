import Hero from "@/components/home/hero-home";
import Navbar from "@/components/shared/navbar";
import useAuthStore from "@/lib/store/auth-store";
import { Navigate } from "react-router-dom";
import Carousel from "@/components/home/carousel-home";

const HomePage = () => {
  const { authenticated } = useAuthStore();

  if (authenticated) {
    return <Navigate to={"/app/labs"} />;
  }

  return (
    <section className="main relative h-full w-full overflow-x-clip flex flex-col justify-center items-center">
      <Navbar />
      <div className="border relative flex flex-col items-center justify-center h-screen w-full gap-10">
        <img
          src="/assets/vectors/beam.svg"
          alt="LIGHT BEAM"
          className="absolute z-10 w-2/3 h-full  -right-48 -top-1 pointer-events-none"
        />
        <Hero />
        <Carousel />
      </div>
      <div className="flex flex-col w-full bg-white">
        <div className="flex text-black flex-col justify-center items-center gap-4 w-full h-full bg-white">
          <h2>
            Lumini is a powerful code collaboration tool that helps you
            streamline your workflow and boost productivity.
          </h2>
          <p>
            With Lumini, you can easily collaborate with your team, manage your
            projects, and stay organized. Whether you're a developer, designer,
            or project manager, Lumini has the tools you need to succeed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
