import React from "react";
import SidebarMenu from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div className="flex h-full bg-dark-cyan">
        <div>
          <SidebarMenu />
        </div>
        <div className="bg-dark-cyan w-screen">
          <main>{children}</main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
