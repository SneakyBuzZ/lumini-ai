import { cn } from "@/utils/cn.util";

interface LogoProps {
  withText?: boolean;
  imgClassName?: string;
  className?: string;
}

const Logo = ({ withText = false, imgClassName, className }: LogoProps) => {
  if (!withText) {
    return (
      <div className={cn("flex justify-start items-center gap-1", className)}>
        <img
          src="/assets/vectors/logo.svg"
          alt="Logo Image"
          className={cn("h-3", imgClassName)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className={cn("flex justify-start items-center gap-1", className)}>
        <img
          src="/assets/vectors/logo.svg"
          alt="Logo Image"
          className={cn("size-8", imgClassName)}
        />
        <span className="tracking-tight text-2xl text-white">Lumini</span>
      </div>
    </div>
  );
};

export default Logo;
