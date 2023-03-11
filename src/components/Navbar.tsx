import { signOut } from 'next-auth/react';

const Navbar = () => {
  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <a className="text-xl normal-case btn btn-ghost">WordlyPins</a>
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
