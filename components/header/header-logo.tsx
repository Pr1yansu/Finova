import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex">
        <Image src={"/logo.svg"} alt="Logo" height={28} width={28} />
        <p className="font-extrabold text-white text-2xl ml-2">FINOVA</p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
