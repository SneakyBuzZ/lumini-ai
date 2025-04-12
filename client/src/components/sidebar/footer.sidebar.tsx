import useUserStore from "@/lib/store/user.store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const FooterSidebar = () => {
  const { user } = useUserStore();
  return (
    <div>
      <div className="z-20 flex justify-start items-start w-full rounded-md bg-midnight-200 border border-neutral-900 gap-2 p-3">
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
      </div>
    </div>
  );
};

export default FooterSidebar;
