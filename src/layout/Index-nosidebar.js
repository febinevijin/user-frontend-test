import React from "react";
import { Outlet } from "react-router-dom";
import Head from "./head/Head";
import bg2 from "../../src/images/bg2.png";

const Layout = ({title, ...props}) => {

  return (
    <>
      <Head title={!title && 'Loading'} />
      <div className="nk-app-root">
        <div className="nk-wrap nk-wrap-nosidebar">
          <div className="nk-content glassbg">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
export default Layout;
