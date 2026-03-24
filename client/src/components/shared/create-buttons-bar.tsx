import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";

interface CreateButtonsBarProps {
  slug: string;
}

export default function CreateButtonsBar({ slug }: CreateButtonsBarProps) {
  const navigate = useNavigate();
  const handleCreateLab = () => {
    navigate({ to: "/dashboard/new/$slug", params: { slug } });
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex justify-start items-center bg-midnight-200 border border-neutral-800 rounded-md px-2">
        <Search className="size-4" />
        <Input
          className="bg-transparent border-none"
          placeholder="Search for a Lab"
        />
      </div>
      <div className="flex justify-start items-center gap-3">
        <Button
          variant={"secondary"}
          className="gap-2 flex items-center"
          onClick={handleCreateLab}
        >
          <CirclePlus />
          New Lab
        </Button>
      </div>
    </div>
  );
}
