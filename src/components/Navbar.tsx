import { signOut } from 'next-auth/react';
import Image from 'next/image';

const Navbar = () => {
  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <a className="space-x-2 text-xl normal-case btn btn-ghost">
          <Image width={32} height={32} alt="worldy-pins" src={'/globe.svg'} />
          <p>WordlyPins</p>
        </a>
      </div>
      <div className="flex-none cursor-pointer">
        <button className="btn btn-sm" onClick={() => signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
