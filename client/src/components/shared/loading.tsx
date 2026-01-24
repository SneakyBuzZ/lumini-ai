import Logo from "./logo";
import Spinner from "./spinner";

export default function Loading() {
  return (
    <div className="h-full w-full flex justify-center items-center gap-4">
      <Logo withText />
      <span className="text-3xl text-neutral-700 font-thin">|</span>
      <div className="flex justify-center items-center gap-2">
        <Spinner />
        <span>Loading</span>
      </div>
    </div>
  );
}
