// import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ChevronsUpDown } from "lucide-react";

const FooterSidebar = () => {
  return (
    <div className="z-20 flex justify-between items-center w-full rounded-md bg-midnight-200 border border-neutral-900 gap-2 p-3">
      {/* <div className="flex justify-start items-center gap-1">
        {user.image ? (
          <>
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback>user</AvatarFallback>
            </Avatar>
          </>
        ) : (
          <>
            <div className="h-9 w-9 rounded-full flex justify-center items-center bg-neutral-500 text-black">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </>
        )}

        <div className="flex flex-col justify-start items-start">
          <span className="text-sm font-semibold">
            {user.name || "Lumini User"}
          </span>
          <span className="text-[10px] text-neutral-400">{user.email}</span>
        </div>
      </div> */}
      <ChevronsUpDown className="h-4" color="#6a6a6a" />
    </div>
  );
};

export default FooterSidebar;
