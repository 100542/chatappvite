import NavBar from "./Nav";

export default function Index() {
  return (
    <>
    <NavBar/>
      <div className="flex flex-row justify-center items-center h-full w-full absolute z-10">
        <div className="flex flex-row justify-center">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl lg:text-7xl font-bold">
              Aurelia Enterprises
            </h1>
            <p className="font-light text-md text-center lg:text-center lg:text-xl">
              Your hub for the management of finances & networking.
            </p>
            <button className="mt-8 p-4 w-52 bg-[#E1C09D] hover:bg-[#e8ab69] hover:cursor-pointer rounded-md shadow-md font-bold text-2xl">Clock In</button>
          </div>
        </div>
      </div>
    </>
  );
}
