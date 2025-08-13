import Logo from "@/components/shared/logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/lib/store/auth.store";
import { NAVBAR_LIST } from "@/lib/lists/navbar.list";

const Navbar = () => {
  const navigate = useNavigate();
  const { authenticated } = useAuthStore();

  return (
    <nav className="w-full absolute top-0 z-50 h-[75px] flex justify-between items-center bg-none px-7">
      <Link to="/" className="w-[100px]">
        <Logo withText />
      </Link>
      <MenuBar />
      <div className="flex justify-end items-center gap-4">
        {/* <div className="flex justify-start items-center gap-[1px] border-[1px] p-2 px-3 rounded-sm">
          <GithubIcon color="#f2f2f2" size={15} />
          <Star color="#E29726" size={10} />
        </div> */}

        <div className="hidden md:flex justify-start items-center gap-2">
          {authenticated ? (
            <>
              <Button onClick={() => navigate("/app")}>Application</Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("auth/login")} variant={"link"}>
                Login
              </Button>
              <Button
                onClick={() => navigate("/auth/register")}
                variant={"secondary"}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const MenuBar = () => {
  const { pathname } = useLocation();
  return (
    <ul className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit border flex justify-center items-center bg-neutral-900/50 backdrop-blur-sm border-neutral-800/40 gap-4 p-1 rounded-lg">
      {NAVBAR_LIST.map((item) => (
        <Link
          key={item.id}
          className={`text-md p-1 px-3 ${
            item.href === pathname
              ? "text-neutral-200 bg-neutral-800/50 border border-neutral-700/40 p-1 px-3 rounded-md"
              : "text-neutral-400 p-1"
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
