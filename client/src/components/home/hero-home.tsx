import { TextEffect } from "../motion-ui/text-effect";
import { TextShimmer } from "../motion-ui/text-shimmer";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="z-20 flex w-full px-20">
      <div className="w-1/2 flex flex-col justify-center items-start gap-4">
        <div className="flex flex-col justify-start items-start gap-2">
          <span className="rounded-full px-6 py-1 text-neutral-300 bg-midnight-100/80 border border-neutral-800 text-xs">
            Explore Lumini
          </span>
          <HeroHeader />
        </div>
        <HeroCTA />
      </div>
    </div>
  );
};

const HeroHeader = () => {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <TextEffect
        per="char"
        preset="fade"
        className="text-5xl font-semibold tracking-tight"
      >
        Powerful code collaboration without the chaos
      </TextEffect>
      <TextShimmer
        duration={1.5}
        spread={2}
        className="text-xl font-light text-neutral-500 tracking-tight"
      >
        Built for dev teams who move fast and build smart
      </TextShimmer>
    </div>
  );
};

const HeroCTA = () => {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <div className="flex">
        <Button>Get Started</Button>
        <Button variant="outline" className="ml-4">
          Learn More
        </Button>
      </div>
      <p className="text-md text-neutral-500">
        Your one-stop solution for all your lab needs.
      </p>
    </div>
  );
};

export default Hero;
