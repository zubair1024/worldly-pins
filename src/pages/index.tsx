import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DashboardScreen from './dashboard';

const Home = () => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin');
  }, [router, status]);

  if (status === 'authenticated') {
    return <DashboardScreen />;
  }

  return <h1>loading</h1>;
};

export default Home;
