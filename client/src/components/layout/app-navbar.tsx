import { Bell } from "lucide-react";
import NavbarBreadcrumb from "@/components/shared/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuthStore from "@/lib/store/auth-store";

const AppNavbar = () => {
  const { user } = useAuthStore();
  if (!user) return <>NHI HAI</>;
  return (
    <nav className="w-full h-[50px] flex justify-between items-center backdrop-blur-md px-7 border-b border-neutral-900 shrink-0">
      <NavbarBreadcrumb />
      <div className="flex justify-end items-center gap-4">
        <Bell className="size-5" />
        <div className="flex justify-center items-center p-1 px-3 pr-4 gap-2 border border-midnight-100 bg-midnight-200 hover:bg-midnight-100 transition-all duration-500 rounded-md cursor-pointer">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
