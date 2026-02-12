import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import HeroImage from "./hero-image";

export default function HeroSection() {
  return (
    <div className="w-full px-24">
      <div className="flex flex-col justify-center items-center border-x border-dashed border-neutral-700 pt-28">
        <div className="flex flex-col justify-center items-center">
          <span className="rounded-full text-sm text-neutral-200 bg-midnight-100/70 border border-neutral-800 mb-4 px-5 p-1">
            Welcome to Lumini AI Beta!
          </span>
          <div className="flex flex-col justify-center items-center text-center gap-4 mb-6">
            <h1 className="text-5xl font-semibold text-neutral-300/90 tracking-tight font-manrope">
              <span className="font-audiowide font-normal">Reimagine</span> Code
              Collaboration and
              <br /> Understanding{" "}
              <span className="font-audiowide font-normal">with</span>{" "}
              <span className="text-neutral-100">Lumini AI</span>
            </h1>
            <p className="text-md font-extralight text-neutral-500">
              Collaborate seamlessly, code efficiently, and commit with
              confidence - all happening live, in real-time.
              <br />
              Powered by AI, Built for Developers trying to explore unknown
              codebases.
            </p>
            <div className="flex justify-center items-center gap-2">
              <Button>Learn More</Button>
              <Button variant={"primary"}>
                Get Started
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
        <HeroImage />
        <div className="absolute bottom-0 w-full h-[1px] border-t border-dashed border-neutral-700 z-20" />
      </div>
    </div>
  );
}
