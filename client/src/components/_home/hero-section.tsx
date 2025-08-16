import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="flex flex-col justify-center items-center -translate-y-16">
      <Button
        variant={"outline"}
        className="rounded-full text-white border-neutral-600 px-8 h-7  mb-4"
        size={"sm"}
        disabled
      >
        Welcome to Lumini AI
      </Button>
      <div className="flex flex-col justify-center items-center text-center mb-8">
        <h1 className="text-5xl font-medium text-white">
          Reimagine Code Collaboration
        </h1>
        <p className="mt-4 text-xl text-neutral-500">
          Collaborate, Code, and Commit - All in Real-Time. Powered by AI.
          Integrated with GitHub
        </p>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button variant={"outline"}>Get Started</Button>
        <Button>
          Learn More
          <MoveUpRight size={16} />
        </Button>
      </div>
    </div>
  );
}
