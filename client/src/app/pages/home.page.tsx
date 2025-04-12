import Hero from "@/components/home/hero.home";
import Navbar from "@/components/shared/navbar";

const HomePage = () => {
  return (
    <section className="relative h-full w-full flex flex-col justify-center items-center gap-5">
      <img
        src="/assets/vectors/light-beam.svg"
        className="absolute w-[400px] -top-40 right-40"
        alt="Light Beam"
      />
      <Navbar />
      <Hero />
    </section>
  );
};

export default HomePage;
