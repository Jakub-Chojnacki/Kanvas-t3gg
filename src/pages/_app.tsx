import { AppContext, AppProps } from "next/app";
import { useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { getCookie, setCookie } from "cookies-next";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";

import { api } from "~/utils/api";

import "~/styles/globals.css";

type MantineProps = {
  colorScheme: ColorScheme;
};

const MyApp = ({ Component, pageProps }: AppProps & MantineProps) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    pageProps.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    // when color scheme is updated save it to cookie
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ClerkProvider {...pageProps}>
          <Component {...pageProps} />
        </ClerkProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
MyApp.getInitialProps = async (appContext: AppContext) => {
  const color = getCookie("mantine-color-scheme", appContext.ctx);

  return {
    pageProps: { colorScheme: color },
  };
};
export default api.withTRPC(MyApp);
