import { Bell } from "lucide-react";
import NavbarBreadcrumb from "@/components/shared/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetUser } from "@/lib/api/queries/user-queries";
import { Skeleton } from "@/components/ui/skeleton";

const AppNavbar = () => {
  const { data: user, isPending } = useGetUser();

  if (isPending) {
    return (
      <nav className="w-full h-[47px] flex justify-between items-center backdrop-blur-md px-7 border-b border-neutral-900 shrink-0">
        <Skeleton className="w-1/3 h-5" />
        <div className="flex justify-end items-center gap-4">
          <div className="flex justify-center items-center gap-2 rounded-md cursor-pointer">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-20 text-sm font-medium hover:underline" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full h-[47px] flex justify-between items-center backdrop-blur-md px-7 border-b border-neutral-900 shrink-0">
      <NavbarBreadcrumb />
      <div className="flex justify-end items-center gap-2">
        <Bell className="size-4" />
        {user && (
          <div className="flex justify-center items-center gap-1 rounded-md cursor-pointer hover:bg-midnight-200/70 border border-midnight-400 hover:border-midnight-100 px-2 py-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-md font-regular">Profile</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;
