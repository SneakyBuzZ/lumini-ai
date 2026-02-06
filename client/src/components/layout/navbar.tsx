import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { NAVBAR_LIST } from "@/utils/list-util";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

const Navbar = () => {
  const authenticated = true;
  const navigate = useNavigate();

  return (
    <nav className="absolute z-30 top-0 w-full h-[56px] flex justify-between items-center bg-midnight-400/80 backdrop-blur-md px-10 border-dashed border-b border-neutral-700">
      <div className="w-full h-full flex justify-between items-center border-dashed border-x border-neutral-700 px-8">
        <Link to="/" className="w-[100px]">
          <Logo withText />
        </Link>
        <MenuBar />
        <div className="flex justify-end items-center gap-4">
          <div className="hidden md:flex justify-start items-center gap-2">
            {authenticated ? (
              <>
                <Button onClick={() => navigate({ to: "/dashboard" })}>
                  Application
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate({ to: "/auth/login" })}
                  variant={"outline"}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate({ to: "/auth/register" })}
                  variant={"secondary"}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const MenuBar = () => {
  const { location } = useRouterState();
  const { pathname } = location;
  return (
    <ul className="w-fit flex justify-center items-center gap-4 p-1 rounded-lg">
      {NAVBAR_LIST.map((item) => (
        <Link
          key={item.id}
          className={`text-md p-1 px-3 ${
            item.href === pathname ? "text-neutral-200" : "text-neutral-400"
          }`}
          to={item.href}
        >
          {item.label}
        </Link>
      ))}
    </ul>
  );
};

export default Navbar;
