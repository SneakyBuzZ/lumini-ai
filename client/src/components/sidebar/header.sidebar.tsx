import Logo from "@/components/shared/logo";
import useWorkspaceStore from "@/lib/store/workspace.store";

const HeaderSidebar = () => {
  const { workspaces } = useWorkspaceStore();
  return (
    <div className="z-20 relative flex flex-col justify-center items-start h-[50px]">
      {workspaces && workspaces.length > 0 ? (
        <>
          <div className="flex justify-start items-center gap-3">
            <Logo imgClassName="h-5" />
            <span className="text-xl font-light text-neutral-400">/</span>
            <h3 className="font-space text-xl text-neutral-200">
              {workspaces[0].name}
            </h3>
            {workspaces[0].plan === "free" && <>{workspaces[0].plan}</>}
          </div>
        </>
      ) : (
        <>
          {" "}
          <Logo withText />
        </>
      )}
    </div>
  );
};

export default HeaderSidebar;
