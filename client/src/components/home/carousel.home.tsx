import { SiEraser } from "react-icons/si";
import { InfiniteSlider } from "../motion-ui/infinite-slider";
import { PiOpenAiLogo } from "react-icons/pi";
import { ImGithub } from "react-icons/im";
import { VscVscode } from "react-icons/vsc";

const Carousel = () => {
  return (
    <div className="z-20 flex flex-col items-start px-10 md:px-20 w-full gap-4">
      <div className="flex flex-col justify-center items-start">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-200">
          All your tools in one place
        </h2>
        <p className="w-full text-md tracking-tight text-neutral-400">
          Lumini brings together your favorite developer tools, all in one place
        </p>
      </div>

      <div className="z-0 py-1 w-5/12">
        <InfiniteSlider gap={80} reverse className="px-4">
          <SiEraser className="size-7" />
          <PiOpenAiLogo className="size-7" />
          <ImGithub className="size-7" />
          <VscVscode className="size-7" />
          <SiEraser className="size-7" />
          <PiOpenAiLogo className="size-7" />
          <ImGithub className="size-7" />
          <VscVscode className="size-7" />
        </InfiniteSlider>
      </div>

      <span className="text-sm text-neutral-600 w-1/3">
        Whether you're writing code, collaborating with AI, or pushing to
        GitHub, Lumini syncs it all into a unified workspace.
      </span>
    </div>
  );
};

export default Carousel;
