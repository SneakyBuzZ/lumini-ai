import Logo from "@/components/shared/logo";
import { FOOTER_LISTS } from "@/lib/lists/footer.list";
import { SOCIAL_LISTS } from "@/lib/lists/social.list";
import { ArrowUpIcon } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full flex-col justify-center items-center border-t">
      <div className="flex flex-col md:flex-row w-full items-center justify-between gap-10 p-7 md:p-10">
        <div className="flex flex-col w-full md:w-1/2 justify-start items-start gap-3">
          <div className="flex justify-start items-center gap-2">
            <Logo imgClassName="size-8" />
            <span className="text-3xl md:text-4xl">Nxtgen</span>
          </div>
          <p className="text-sm md:text-base">
            Your Comprehensive Knowledge Hub for Technology. Discover the Future
            Through Curated, Community-Driven Documentation.
          </p>
          <ul className="flex gap-3 w-full py-2">
            {SOCIAL_LISTS.map((social) => (
              <li
                key={social.id}
                className="border p-2 rounded-md flex justify-center items-center"
              >
                <a href={social.url} target="_blank" rel="noreferrer">
                  <social.component className="w-5 h-5" color="#b3b3b3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col w-full md:w-1/3 justify-start items-end gap-5">
          <div className="flex w-full justify-start items-start gap-10">
            {FOOTER_LISTS.map((list) => (
              <div
                key={list.id}
                className="flex flex-col justify-center items-start"
              >
                <h4 className="text-sm md:text-base font-semibold">
                  {list.title}
                </h4>
                <ul className="flex flex-col justify-center items-start">
                  {list.subMenu.map((sub) => (
                    <li key={sub.id}>
                      <a
                        href={sub.route}
                        className="text-xs md:text-sm transition-all duration-200"
                      >
                        {sub.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center py-3">
        <p className="text-center text-xs">
          ©2024-25 Developer Student Society
        </p>
        <button
          className="ml-2"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
