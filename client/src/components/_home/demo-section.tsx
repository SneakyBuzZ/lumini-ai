import { Button } from "../ui/button";

export default function DemoSection() {
  return (
    <div className="w-full relative px-24">
      <div className="w-full flex justify-center items-center border-x border-dashed border-neutral-700 px-16 gap-20 py-16">
        <img
          src="/assets/vectors/logo-word.svg"
          alt="Lumini Logo"
          className="w-80"
        />

        <div className="flex flex-col gap-4 max-w-2xl">
          <h3 className="text-neutral-200 text-4xl font-semibold leading-tight">
            Turn Any GitHub Repository Into an AI-Searchable Knowledge Base
          </h3>

          <p className="text-neutral-400 leading-relaxed">
            Lumini helps engineering teams understand complex codebases faster.
            Paste a GitHub repository URL, create a structured workspace, and
            start asking contextual questions powered by intelligent vector
            search. Explore architecture, uncover dependencies, and collaborate
            with your team — all grounded in your actual source code.
          </p>

          <Button variant={"bright"} className="max-w-xs mt-4">
            Schedule a Live Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
