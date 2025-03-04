import { useState } from "react";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import { Link } from 'react-router';
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoNoBg from "../assets/LogoNoBg.png";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="w-full h-20 fixed top-0 left-0 z-20 p-8 flex flex-row justify-between items-center">
        <div className="flex flex-row justify-center items-center">
          <Link to={"/"}>
          <img src={LogoNoBg} alt="Logo" className="w-10 h-14" />
          </Link>
          <h1 className="hidden lg:block font-bold text-3xl text-center ml-4 [text-shadow:_0_2px_4px_rgba(0,0,0,0.2)]">
            Aurelia Enterprises
          </h1>
        </div>
        
        <div className="hidden lg:flex flex-row gap-16">
          <Link to={"/"}>
          <p className="text-xl font-light">
            <CottageOutlinedIcon />
            <span className="ml-2 [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]">Home</span>
          </p>
          </Link>
          <Link to={"/"}>
          <p className="text-xl font-light">
            <InfoOutlinedIcon />
            <span className="ml-2 [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]">About</span>
          </p>
          </Link>
          <Link to={"/network"}>
          <p className="text-xl font-light">
            <ChatOutlinedIcon />
            <span className="ml-2 [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]">Network</span>
          </p>
          </Link>
        </div>

        <div className="lg:hidden cursor-pointer" onClick={() => setMenuOpen(true)}>
          <MenuIcon fontSize="large" />
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-30 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-end">
            <CloseIcon className="cursor-pointer" fontSize="large" onClick={() => setMenuOpen(false)} />
          </div>
          <nav className="mt-10 flex flex-col gap-6 text-xl font-light">
            <Link to={"/"}>
            <p className="flex items-center cursor-pointer" onClick={() => setMenuOpen(false)}>
              <CottageOutlinedIcon />
              <span className="ml-3">Home</span>
            </p>
            </Link>
            <Link to={'/'}>
            <p className="flex items-center cursor-pointer" onClick={() => setMenuOpen(false)}>
              <InfoOutlinedIcon />
              <span className="ml-3">About</span>
            </p>
            </Link>
            <Link to={'/network'}>
            <p className="flex items-center cursor-pointer" onClick={() => setMenuOpen(false)}>
              <ChatOutlinedIcon />
              <span className="ml-3">Network</span>
            </p>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
