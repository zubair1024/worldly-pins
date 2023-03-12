import Image from 'next/image';

const ScreenLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <Image src="/globe.svg" width={200} height={200} alt="globe_loader" />
      <p className="pt-6 text-3xl font-light">Loading</p>
    </div>
  );
};

export default ScreenLoader;
