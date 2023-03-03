import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';

const DashboardScreen = (props: { mapApiKey: string }) => {
  const DynamicMap = dynamic(
    () => import('../components/Map'), // replace '@components/map' with your component's location
    { ssr: false }, // This line is important. It's what prevents server-side render
  );

  return (
    <Layout>
      <div className="h-[100vh]">
        <DynamicMap apiKey={props.mapApiKey}></DynamicMap>
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
