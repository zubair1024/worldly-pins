import { signOut } from 'next-auth/react';

const DashboardScreen = () => {
  return (
    <div>
      <button onClick={() => signOut()}>Sign Out </button>
    </div>
  );
};

DashboardScreen.auth = true;

export default DashboardScreen;
