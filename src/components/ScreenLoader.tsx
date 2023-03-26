import Image from 'next/image';

const ScreenLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image src="/globe.svg" width={200} height={200} alt="globe_loader" />
    </div>
  );
};

export default ScreenLoader;
