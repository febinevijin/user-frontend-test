import React from "react";
import { Outlet } from "react-router-dom";
import AppRoot from "./global/AppRoot"; 
import AppWrap from "./global/AppWrap"; 
import Header from "../pages/pre-built/website/Header";
import Head from "./head/Head";
import Webfooter from "../pages/pre-built/website/Webfooter";

const WebsiteLayout = ({title, ...props}) => {
  return (
    <div id="mainPage">
    <Head title={!title && 'Loading'} />
      <Header />
      <AppRoot>
        <AppWrap>
          <Outlet />
        </AppWrap>
      </AppRoot>
     <Webfooter/>
    </div>
  );
};

export default WebsiteLayout;
