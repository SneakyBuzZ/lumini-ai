import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe, SquarePlus } from "lucide-react";
import { toast } from "sonner";

const AskPage = () => {
  const handleClick = () => {
    // getAskQuestion();
    toast("Something Went wrong! Please try again.");
  };

  return (
    <div className="w-full flex flex-col justify-center items-center py-20 bg-neutral-100/80 dark:bg-midnight-300  gap-6">
      <div className="flex flex-col justify-center items-center w-2/3 gap-2">
        <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-400">
          Ask anything to your Repository!
        </h2>
        <p className="text-sm text-neutral-600 text-center">
          This is the page where you can ask anything to your repository. You
          can ask for the latest commits, contributors, issues, pull requests,
          and much more.
        </p>
      </div>
      <div className="flex flex-col justify-start items-center w-2/3 gap-4">
        <Card className="w-full flex flex-col justify-evenly items-start shadow-none h-40 p-4 bg-midnight-100/60 border-neutral-900/50">
          <Input
            className="shadow-none border-none bg-transparent"
            placeholder="Ask your repository..."
          />
          <div className="flex justify-between items-center p-2 mt-10 w-full">
            <div className="flex justify-start items-center gap-3">
              <div className="flex justify-center items-center">
                <SquarePlus color="#737373" size={15} />
                <span className="text-sm text-neutral-600 ml-2">Add File</span>
              </div>
              <div className="flex justify-center items-center">
                <Globe color="#737373" size={15} />
                <span className="text-sm text-neutral-600 ml-2">
                  Search Web
                </span>
              </div>
            </div>
            <Button onClick={handleClick}>Submit</Button>
          </div>
        </Card>
        <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full  ">
          <Card className="p-3 shadow-none bg-midnight-300 border-neutral-900">
            <p className="text-sm text-neutral-600">
              Ask for the latest commits
            </p>
          </Card>
          <Card className="p-3 shadow-none bg-midnight-300 border-neutral-900">
            <p className="text-sm text-neutral-600 ">
              Ask for the contributors
            </p>
          </Card>
          <Card className="p-3 shadow-none bg-midnight-300 border-neutral-900">
            <p className="text-sm text-neutral-600 ">Ask for the issues</p>
          </Card>
          <Card className="p-3 shadow-none bg-midnight-300 border-neutral-900">
            <p className="text-sm text-neutral-600 ">
              Ask for the pull requests
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AskPage;
