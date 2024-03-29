import Layout from '@/components/Layout';
import ModalControl from '@/components/ModalControl';
import ScreenLoader from '@/components/ScreenLoader';
import useGlobalStore from '@/lib/store';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DashboardScreen = (props: { mapApiKey: string }) => {
  const { fetchUserCountries, userCountries, userCities, fetchUserCities } =
    useGlobalStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchUserCountries();
      await fetchUserCities();
      setIsLoading(false);
    };
    fetchData();
  }, [fetchUserCities, fetchUserCountries]);

  const DynamicMap = dynamic(
    () => import('../components/Map'), // replace '@components/map' with your component's location
    { ssr: false }, // This line is important. It's what prevents server-side render
  );

  return (
    <Layout>
      <div className="h-[100vh]">
        {isLoading ? (
          <ScreenLoader />
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
