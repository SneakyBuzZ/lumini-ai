import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { NAVBAR_LIST } from "@/utils/list-util";
import { Link, useNavigate } from "@tanstack/react-router";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MoveUpRight } from "lucide-react";
import { useGetIsAuthenticated } from "@/lib/api/queries/user-queries";

const Navbar = () => {
  const { data: isAuthenticated } = useGetIsAuthenticated();

  return (
    <nav
      aria-label="Primary navigation"
      className="absolute z-30 top-0 w-full h-[56px] flex justify-between items-center bg-midnight-400/80 backdrop-blur-md px-24 border-dashed border-b border-neutral-700"
    >
      <div className="w-full h-full flex justify-between items-center border-dashed border-x border-neutral-700 px-8">
        <Link to="/" className="w-[100px]" aria-label="Lumini Home">
          <Logo withText />
        </Link>

        <div className="flex items-center justify-center">
          <NavMenuBar />
          <Link
            to="/pricing"
            className="ml-4 text-sm text-neutral-300 hover:text-white transition-colors"
          >
            Pricing
          </Link>
        </div>

        <div className="flex justify-end items-center gap-4">
          <div className="hidden md:flex justify-start items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Application</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>

                <Link to="/auth/register">
                  <Button variant="bright">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavMenuBar = () => {
  const navigate = useNavigate();
  return (
    <Menubar className="w-fit flex justify-center items-center p-1 rounded-3xl border-none bg-transparent">
      {NAVBAR_LIST.map((item) => (
        <MenubarMenu key={item.id}>
          <MenubarTrigger className="text-sm font-medium text-neutral-300 cursor-pointer">
            {item.label}
          </MenubarTrigger>
          <MenubarContent
            align="center"
            className="min-w-[30rem] grid grid-cols-2 p-2 rounded-2xl bg-midnight-300/80 backdrop-blur-3xl border border-neutral-800/60 shadow-black/30 shadow-lg translate-y-6"
          >
            {item.children.map((child) => (
              <MenubarItem
                key={child.id}
                className="group flex items-center justify-between gap-4 p-4 rounded-xl transition-colors hover:bg-midnight-100 border border-transparent hover:border-neutral-800 cursor-pointer"
                onClick={() => navigate({ to: child.href })}
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={child.icon}
                      alt={`${child.title} icon`}
                      className="w-5 h-5 opacity-80"
                    />
                    <span className="font-semibold text-neutral-200">
                      {child.title}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                    {child.content}
                  </p>
                </div>

                <MoveUpRight
                  className="opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-neutral-500 h-4 w-4 mt-1"
                  strokeWidth={2}
                />
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
};

export default Navbar;
