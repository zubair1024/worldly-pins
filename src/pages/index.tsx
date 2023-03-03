import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home = () => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin');
  }, [router, status]);

  if (status === 'authenticated') {
    router.push('/dashboard');
  }

  return <h1>Loading</h1>;
};

export default Home;
