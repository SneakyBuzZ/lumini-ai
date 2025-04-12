import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryClientProviderProps {
  children: React.ReactNode;
}

const QueryProvider = ({ children }: QueryClientProviderProps) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
