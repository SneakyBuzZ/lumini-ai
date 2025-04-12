import Logo from "@/components/shared/logo";
import { GithubIcon, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/lib/store/auth.store";
import { NAVBAR_LIST } from "@/lib/lists/navbar.list";

const Navbar = () => {
  const navigate = useNavigate();
  const { authenticated } = useAuthStore();

  return (
    <nav className="w-full sticky top-0 z-50 h-[55px] flex justify-between items-center bg-none px-7">
      <Link to="/">
        <Logo withText />
      </Link>
      <ul className="border flex justify-center items-center bg-none backdrop-blur-2xl border-neutral-800/30 gap-8 p-2 px-6 rounded-lg">
        {NAVBAR_LIST.map((item) => (
          <Link
            key={item.id}
            className="text-md text-neutral-200"
            to={item.href}
          >
            {item.label}
          </Link>
        ))}
      </ul>
      <div className="flex justify-start items-center gap-4">
        <div className="flex justify-start items-center gap-[1px] border-[1px] p-2 px-3 rounded-sm">
          <GithubIcon color="#f2f2f2" size={15} />
          <Star color="#E29726" size={10} />
        </div>

        <div className="hidden md:flex justify-start items-center gap-2">
          {authenticated ? (
            <>
              <Button onClick={() => navigate("/app")}>Application</Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("auth/login")}
                variant={"outline"}
              >
                Login
              </Button>
              <Button onClick={() => navigate("/auth/register")}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
