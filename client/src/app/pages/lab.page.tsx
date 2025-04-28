import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

const LabPage = () => {
  return (
    <section className="w-full h-svh flex flex-col justify-center items-center gap-5">
      <Logo withText className="w-24" />
      <div className="flex flex-col justify-center items-center gap-1">
        <h1 className="text-5xl md:text-7xl font-bold">Issue 500</h1>
        <p className="text-lg">Server not responding</p>
      </div>
      <Button variant={"secondary"}>Please try again</Button>
    </section>
  );
};

export default LabPage;
