import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import ModalControl from '@/components/ModalControl';
import useGlobalStore from '@/lib/store';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DashboardScreen = (props: { mapApiKey: string }) => {
  const { fetchUserCountries, userCountries, userCities } = useGlobalStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchUserCountries();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const DynamicMap = dynamic(
    () => import('../components/Map'), // replace '@components/map' with your component's location
    { ssr: false }, // This line is important. It's what prevents server-side render
  );

  return (
    <Layout>
      <div className="h-[100vh]">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="relative h-full">
            <div className="absolute bottom-20 right-10 z-[99999]">
              <ModalControl />
            </div>
            <DynamicMap
              apiKey={props.mapApiKey}
              countries={userCountries}
              cities={userCities}
            ></DynamicMap>
          </div>
        )}
      </div>
    </Layout>
  );
};

DashboardScreen.auth = true;

export default DashboardScreen;

export async function getServerSideProps() {
  return {
    props: {
      mapApiKey: process.env.MAPBOX_ACCESS_TOKEN,
    },
  };
}
