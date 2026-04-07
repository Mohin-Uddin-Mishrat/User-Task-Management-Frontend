"use client";

import { Provider } from "react-redux";
import { AuthBootstrap } from "@/components/auth-bootstrap";
import { store } from "@/redux/store";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
