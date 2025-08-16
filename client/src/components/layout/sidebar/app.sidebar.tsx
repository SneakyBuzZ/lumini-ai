import HeaderSidebar from "@/components/layout/sidebar/header.sidebar";
import FooterSidebar from "@/components/layout/sidebar/footer.sidebar";
import ContentSidebar from "@/components/layout/sidebar/content.sidebar";

const AppSidebar = () => {
  return (
    <div className="h-full w-[17rem] flex flex-col border-r border-r-neutral-900 p-3 px-4">
      <div className="z-10 absolute h-20 w-20 bg-neutral-600 blur-[100px]" />
      <HeaderSidebar />
      <ContentSidebar />
      <FooterSidebar />
    </div>
  );
};

export default AppSidebar;
