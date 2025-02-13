import LogoHiRes from "../assets/LogoHiRes.png";

export default function NavBar() {
  return (
    <>
      <div className="w-full h-20 absolute z-10 border-b-4 p-4 border-[#E1C09D] flex flex-row justify-between items-center">
        <div className="flex flex-row justify-center">
          <img src={LogoHiRes} alt="Logo" className="w-14 h-14" />
          <h1>Aurelia Enterprises</h1>
        </div>
      </div>
    </>
  );
}
