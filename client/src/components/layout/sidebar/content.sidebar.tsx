import { LAB_SIDEBAR_LIST, SIDEBAR_LIST } from "@/lib/lists/sidebar.list";
import useLabStore from "@/lib/store/lab-store";
import { Link } from "@tanstack/react-router";

const ContentSidebar = () => {
  const { lab } = useLabStore();
  const LIST =
    lab != null
      ? LAB_SIDEBAR_LIST(lab.name.replace(/\s+/g, "-").toLowerCase())
      : SIDEBAR_LIST;
  return (
    <>
      <div className="z-20 w-full flex flex-1 flex-col justify-start items-start gap-6 px-2 py-4">
        {LIST.map((section) => (
          <div
            key={section.name}
            className="w-full flex flex-col justify-center items-start gap-2"
          >
            <div className="h-[1px] w-full bg-neutral-900 mb-3" />
            <span className="text-sm text-neutral-500">{section.name}</span>
            <div className="flex flex-col justify-center items-start gap-2 w-full">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="w-full flex justify-start items-center gap-2 text-md text-neutral-400 p-1 rounded-md"
                >
                  <item.icons className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div className="h-[1px] w-full bg-neutral-900 mb-3" />
      </div>
    </>
  );
};

export default ContentSidebar;
