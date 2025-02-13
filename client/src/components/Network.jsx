import NavBar from "./Nav";
import CompanyData from "../data/network.json";

export default function Network() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center items-center h-full w-full absolute z-10">
        <h1 className="text-4xl lg:text-8xl font-bold [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]">
          Aurelia's Trusted Affiliates
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {CompanyData.data.map((company, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center"
            >
              <p className="text-md text-center lg:text-2xl font-light [text-shadow:_0_2px_4px_rgba(0,0,0,0.2)]">
                {company.companyName}
              </p>
              <button className="text-sm mt-2 hover:bg-[#E1C09D] hover:scale-110 duration-500 border-2 border-[#E1C09D] p-2 rounded-md text-black">View Chat</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
