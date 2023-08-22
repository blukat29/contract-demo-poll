import "bootstrap/dist/css/bootstrap.min.css";

import { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AppProvider = ({ children }: { children: ReactNode }): ReactElement => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default AppProvider;
