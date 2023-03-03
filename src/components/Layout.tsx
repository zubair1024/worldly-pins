import Navbar from './Navbar';

const Layout = (props: { children: JSX.Element }) => {
  return (
    <>
      <Navbar></Navbar>
      {props.children}
    </>
  );
};

export default Layout;
