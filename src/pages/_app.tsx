import { AppContext, AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  ClerkProvider,
  RedirectToSignUp,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { getCookie, setCookie } from "cookies-next";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { dark } from "@clerk/themes";

import BasicLayout from "~/components/BasicLayout";


import { api } from "~/utils/api";

import "~/styles/globals.css";

type MantineProps = {
  colorScheme: ColorScheme;
};

const MyApp = ({ Component, pageProps }: AppProps & MantineProps) => {
  const { pathname } = useRouter();
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

  const publicPages = ["/", "/sign-in/[[...index]]", "/sign-up/[[...index]]"];

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
        <ClerkProvider
          {...pageProps}
          appearance={{
            baseTheme: colorScheme == "dark" ? dark : null,
          }}
        >
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            {publicPages.includes(pathname) ? (
             <BasicLayout><Component {...pageProps} /></BasicLayout> 
            ) : (
              <RedirectToSignUp />
            )}
          </SignedOut>
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
