import React from "react";
import HeaderLogo from "@/components/header/header-logo";
import Navigation from "@/components/header/navigation";
import Profile from "@/components/auth/profile";
import WelcomeMsg from "@/components/header/welcome-msg";
import Filters from "./filters";

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center w-full">
            <HeaderLogo />
            <Navigation />
          </div>
          <Profile />
        </div>
        <WelcomeMsg />
        <Filters />
      </div>
    </header>
  );
};

export default Header;
