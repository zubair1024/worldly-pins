import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import ModalControl from '@/components/ModalControl';
import { Country, CountryGEOJSON } from '@prisma/client';
import axios from 'axios';
import { GeoJsonObject } from 'geojson';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DashboardScreen = (props: { mapApiKey: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [countriesGeoJSON, setCountriesGeoJSON] = useState<
    GeoJsonObject[] | undefined
  >(undefined);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('/api/geojson/country')
      .then((res) => {
        console.log(res.data);
        const responseData: (Country & {
          countryGEOJSON: CountryGEOJSON;
        })[] = res.data?.data;
        if (responseData.length) {
          setCountriesGeoJSON(
            responseData.map(
              (i) => i.countryGEOJSON.geoJson as unknown as GeoJsonObject,
            ),
          );
        }
      })
      .finally(() => setIsLoading(false));
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
              countriesGeoJSON={countriesGeoJSON}
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
