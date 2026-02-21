import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useLogout } from "@/lib/api/mutations/user-mutations";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types/user-type";

interface AppNavbarProps {
  user: User | null;
}

export function UserProfile({ user }: AppNavbarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { mutateAsync: logout } = useLogout();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setDialogOpen(false);
    toast("Logged out successfully");
    navigate({ to: "/auth/login" });
  }

  if (!user) return null;

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 border-2 border-neutral-800 cursor-pointer">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 bg-midnight-200">
          <DropdownMenuItem>Profile</DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-400"
            onSelect={() => {
              setMenuOpen(false); // ✅ close dropdown first
              setDialogOpen(true); // ✅ then open dialog
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-midnight-100/80 border-neutral-800 p-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="p-4 border-b border-neutral-800 text-neutral-200">
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription className="p-4 py-2">
              This action will log you out of your account and you will need to
              log in again to access your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="p-4 border-t border-neutral-800 bg-midnight-300/70 rounded-b-xl">
            <AlertDialogCancel className="h-9 bg-midnight-100 hover:bg-neutral-800 text-neutral-200 border-neutral-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-9 bg-red-900 hover:bg-red-800 border-red-800"
              onClick={() => handleLogout()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
