import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="w-full relative z-30 flex justify-start gap-8 py-20">
      <HeroHeader />
      <img
        src="/assets/images/display.png"
        className="absolute right-0 w-[800px]"
        alt="Display"
      />
    </div>
  );
};

const HeroHeader = () => {
  return (
    <div className="w-1/2 flex flex-col justify-center items-start gap-1 p-10">
      <h3 className="w-full text-start font-semibold text-3xl lg:text-5xl tracking-tighter font-space text-white">
        Reimagine Collaboration with Lumini
      </h3>
      <span className="w-full lg:w-2/3 font-light text-sm md:text-lg text-start text-neutral-500">
        Lumini transforms the way teams collaborate on code, making it easier
        than ever to build amazing software together and ship it faster.
      </span>
      <div className="flex justify-start items-center gap-2 my-3">
        <Button>Get Started</Button>
        <Button variant={"outline"}>Start a lab</Button>
      </div>
    </div>
  );
};

export default Hero;
