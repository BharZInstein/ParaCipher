"use client";

import { MetaMaskProvider } from "@metamask/sdk-react";
import { ReactNode } from "react";

interface MetaMaskProviderWrapperProps {
  children: ReactNode;
}

export const MetaMaskProviderWrapper = ({
  children,
}: MetaMaskProviderWrapperProps) => {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "ParaCipher Admin",
          url: typeof window !== "undefined" ? window.location.href : "",
        },
        // Optional: Customize configuration
        checkInstallationImmediately: false,
      }}
    >
      {children}
    </MetaMaskProvider>
  );
};
