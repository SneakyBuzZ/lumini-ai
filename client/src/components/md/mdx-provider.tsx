import { MDXProvider } from "@mdx-js/react";
import { components } from "./md-html";

interface MDXProviderWrapperProps {
  children: React.ReactNode;
}

const MDXProviderWrapper = ({ children }: MDXProviderWrapperProps) => {
  return <MDXProvider components={components}>{children}</MDXProvider>;
};

export default MDXProviderWrapper;
