import { ComponentPropsWithoutRef } from "react";
import { MDXComponents } from "mdx/types";
import CodeblockMDX from "@/components/md/md-codeblock";

export const CustomH1 = (props: ComponentPropsWithoutRef<"h1">) => {
  let id = "default-id";
  if (typeof props.children === "string") {
    id = props.children.toLowerCase().replace(/\s+/g, "-");
  }
  return (
    <h1
      id={id}
      className="text-2xl lg:text-3xl tracking-tight font-semibold text-neutral-200 border-b border-b-app-border-dark py-3"
      {...props}
    />
  );
};

export const CustomH2 = (props: ComponentPropsWithoutRef<"h2">) => {
  let id = "default-id";
  if (typeof props.children === "string") {
    id = props.children.toLowerCase().replace(/\s+/g, "-");
  }
  return (
    <h2
      id={id}
      className="text-xl lg:text-[1.6rem] tracking-tight font-semibold text-neutral-300 py-2 mt-7 md:mt-10"
      {...props}
    />
  );
};

export const CustomH3 = (props: ComponentPropsWithoutRef<"h3">) => {
  let id = "default-id";
  if (typeof props.children === "string") {
    id = props.children.toLowerCase().replace(/\s+/g, "-");
  }
  return (
    <h3
      id={id}
      className="text-lg lg:text-[1.4rem] tracking-tight font-semibold text-neutral-300 mt-5 md:mt-8"
      {...props}
    />
  );
};

export const CustomH4 = (props: ComponentPropsWithoutRef<"h4">) => {
  let id = "default-id";
  if (typeof props.children === "string") {
    id = props.children.toLowerCase().replace(/\s+/g, "-");
  }

  return (
    <h4
      id={id}
      className="text-base lg:text-[1.2rem] tracking-tight font-semibold text-neutral-300 py-1 mt-1 md:mt-4"
      {...props}
    />
  );
};

export const CustomParagraph = (props: ComponentPropsWithoutRef<"p">) => {
  return (
    <p
      className="text-sm lg:text-base font-thin text-neutral-400 py-1"
      {...props}
    />
  );
};

export const CustomLink = (props: ComponentPropsWithoutRef<"a">) => {
  return (
    <a className="text-blue-300 transition-colors underline py-1" {...props} />
  );
};

export const CustomSpan = (props: ComponentPropsWithoutRef<"span">) => {
  return (
    <span
      className="text-sm text-app-secondary-dark dark:text-app-secondary-light py-1"
      {...props}
    />
  );
};

export const CustomUl = (props: ComponentPropsWithoutRef<"ul">) => {
  return (
    <ul className="list-disc my-2 ml-2 text-app-typo-p-dark/80" {...props} />
  );
};

export const CustomOl = (props: ComponentPropsWithoutRef<"ol">) => (
  <ol className="list-decima my-2 ml-4 text-app-typo-p-dark/80" {...props} />
);

export const CustomLi = (props: ComponentPropsWithoutRef<"li">) => (
  <li
    className="text-sm my-2 ml-3 md:text-base text-app-typo-p-dark/90"
    {...props}
  />
);

export const CustomBlockquote = (
  props: ComponentPropsWithoutRef<"blockquote">
) => (
  <blockquote
    className="border-l-4 border-app-primary-dark dark:border-app-primary-light pl-4 italic text-app-secondary-dark dark:text-app-secondary-light"
    {...props}
  />
);

export const CustomImg = (props: ComponentPropsWithoutRef<"img">) => (
  <img className="rounded-xl shadow-lg my-4 w-full object-contain" {...props} />
);

export const CustomStrong = (props: ComponentPropsWithoutRef<"strong">) => (
  <strong className="font-semibold text-app-typo-h2-dark" {...props} />
);

export const CustomEm = (props: ComponentPropsWithoutRef<"em">) => (
  <em className="italic text-app-primary-dark" {...props} />
);

export const CustomTable = (props: ComponentPropsWithoutRef<"table">) => (
  <table
    className="table-auto w-full bg-app-border-dark/30 rounded-md my-2"
    {...props}
  />
);

export const CustomThead = (props: ComponentPropsWithoutRef<"thead">) => (
  <thead className="" {...props} />
);

export const CustomTr = (props: ComponentPropsWithoutRef<"tr">) => (
  <tr className="border-app-border-dark" {...props} />
);

export const CustomTd = (props: ComponentPropsWithoutRef<"td">) => (
  <td
    className="p-3 text-xs md:text-sm text-left text-app-typo-p-dark border-app-border-dark"
    {...props}
  />
);

export const CustomTh = (props: ComponentPropsWithoutRef<"th">) => (
  <th
    className="p-3 text-xs md:text-sm text-left font-semibold border-app-border-dark bg-app-border-dark/40"
    {...props}
  />
);

export const CustomInlineCode = (props: React.ComponentProps<"code">) => {
  return (
    <code
      {...props}
      className="bg-midnight-100 text-app-btn-primary/80 px-1.5 py-1 rounded-md font-dm-mono text-sm"
    />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const components: MDXComponents = {
  h1: CustomH1,
  h2: CustomH2,
  h3: CustomH3,
  h4: CustomH4,
  p: (props) => {
    if (
      props.children &&
      typeof props.children === "object" &&
      "type" in props.children &&
      props.children.type === "pre"
    ) {
      return props.children;
    }

    return <CustomParagraph {...props} />;
  },
  a: CustomLink,
  span: CustomSpan,
  ul: CustomUl,
  ol: CustomOl,
  li: CustomLi,
  blockquote: CustomBlockquote,
  img: CustomImg,
  strong: CustomStrong,
  em: CustomEm,
  table: CustomTable,
  thead: CustomThead,
  tr: CustomTr,
  td: CustomTd,
  th: CustomTh,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: (props: any) => {
    if (props.className) {
      return <CodeblockMDX {...props} />;
    }
    return <CustomInlineCode {...props} />;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pre: (props: any) => <div {...props} />,
};
