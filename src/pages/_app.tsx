import ScreenLoader from '@/components/ScreenLoader';
import '@/styles/globals.css';
import axios, { AxiosError } from 'axios';
import { SessionProvider, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextComponentType, NextPageContext } from 'next/types';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IAppProps extends AppProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: NextComponentType<NextPageContext, any, any> & { auth: boolean };
}

export default function App({ Component, pageProps }: IAppProps) {
  useEffect(() => {
    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      },
    );
  }, []);

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
        <ToastContainer />
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
    return <ScreenLoader />;
  }
  return children;
}
