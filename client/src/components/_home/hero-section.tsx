import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="rounded-full text-sm text-neutral-400 bg-midnight-200 border border-midnight-100 mb-4 px-5 p-1">
        Welcome to Lumini AI Beta!
      </span>
      <div className="flex flex-col justify-center items-center text-center gap-4 mb-6">
        <h1 className="text-5xl font-medium text-neutral-200 font-audiowide">
          Reimagine Code Collaboration <br /> with Lumini AI
        </h1>
        <p className="text-md font-extralight text-neutral-500">
          Collaborate seamlessly, code efficiently, and commit with confidence -
          all happening live, in real-time.
          <br />
          Powered by AI, Built for Developers trying to explore unknown
          codebases.
        </p>
        <div className="flex justify-center items-center gap-2">
          <Button variant={"outline"}>Learn More</Button>
          <Button>
            Get Started
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
