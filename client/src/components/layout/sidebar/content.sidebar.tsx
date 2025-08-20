import { cn } from "@/utils/cn.util";
import { SIDEBAR_LIST } from "@/utils/list-util";
import { Link, useLocation } from "@tanstack/react-router";

const ContentSidebar = () => {
  const { pathname } = useLocation();
  return (
    <>
      <ul className="z-20 w-full flex flex-1 flex-col justify-start items-start gap-6 px-6 py-8">
        {SIDEBAR_LIST.map((section) => (
          <li
            key={section.name}
            className="w-full flex flex-col justify-center items-start gap-2"
          >
            <span className="text-sm text-neutral-500">{section.name}</span>
            <div className="flex flex-col justify-center items-start gap-2 w-full">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "w-full flex  items-center gap-3 text-md text-neutral-400 p-1 px-3 rounded-md border border-midnight-400 transition-all duration-300",
                    {
                      "bg-midnight-200/70 border-midnight-200":
                        pathname === item.href,
                    }
                  )}
                >
                  <item.icons className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ContentSidebar;
