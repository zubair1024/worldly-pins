import '@/styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextComponentType, NextPageContext } from 'next/types';

interface IAppProps extends AppProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: NextComponentType<NextPageContext, any, any> & { auth: boolean };
}

export default function App({ Component, pageProps }: IAppProps) {
  return (
    <>
      <div data-theme="dracula">
        <SessionProvider session={pageProps.session}>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </SessionProvider>
      </div>
    </>
  );
}

function Auth({ children }: { children: JSX.Element }): JSX.Element {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  return children;
}
