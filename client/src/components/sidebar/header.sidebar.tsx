import Logo from "@/components/shared/logo";

const HeaderSidebar = () => {
  return (
    <div className="z-20 relative flex flex-col justify-center items-start h-[50px]">
      <Logo withText />
    </div>
  );
};

export default HeaderSidebar;
