/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Components } from "react-markdown";
import {
  CustomH1,
  CustomH2,
  CustomH3,
  CustomH4,
  CustomParagraph,
  CustomLink,
  CustomSpan,
  CustomUl,
  CustomOl,
  CustomLi,
  CustomBlockquote,
  CustomImg,
  CustomStrong,
  CustomEm,
  CustomTable,
  CustomTd,
  CustomTh,
  CustomThead,
  CustomTr,
  CustomInlineCode,
} from "@/components/md/md-html";
import CodeblockMDX from "@/components/md/md-codeblock";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const components: Components = {
    h1: CustomH1,
    h2: CustomH2,
    h3: CustomH3,
    h4: CustomH4,
    p: (props) => {
      // Check if this paragraph contains a pre/code block
      if (
        props.children &&
        typeof props.children === "object" &&
        "type" in props.children &&
        props.children.type === "pre"
      ) {
        return <>{props.children}</>;
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
    code: (props) => {
      // react-markdown adds these properties, but they're not in the type definition
      const { inline, className, children, ...rest } = props as any;

      // Inline code
      if (inline) {
        return <CustomInlineCode {...rest}>{children}</CustomInlineCode>;
      }

      // Code block with language
      if (className) {
        return (
          <CodeblockMDX className={className} {...rest}>
            {children}
          </CodeblockMDX>
        );
      }

      // Default code block
      return <CustomInlineCode {...rest}>{children}</CustomInlineCode>;
    },
    pre: ({ children, ...props }) => {
      // Extract the ref to avoid type mismatch, then spread remaining props
      const { ...rest } = props as any;
      return <div {...rest}>{children}</div>;
    },
  };

  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
