import NavBar from "./Nav";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <>
    <NavBar/>
      <div className="flex flex-row justify-center items-center h-full w-full absolute z-10">
        <div className="flex flex-row justify-center">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl lg:text-8xl font-bold [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]">
             Aurelia Enterprises
            </h1>
            <p className="font-light text-md text-center lg:text-center lg:text-xl mt-2 [text-shadow:_0_2px_4px_rgba(0,0,0,0.2)]">
              Your hub for the management of finances & networking.
            </p>
            <Link to="/network"><button className="mt-8 p-4 w-52 bg-[#E1C09D] hover:bg-[#ffd2a2] duration-300 hover:scale-110 hover:cursor-pointer rounded-md shadow-md font-bold text-2xl">Clock In</button></Link>
          </div>
        </div>
      </div>
    </>
  );
}
