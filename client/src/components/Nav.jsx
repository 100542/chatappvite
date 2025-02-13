import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import LogoNoBg from '../assets/LogoNoBg.png';

export default function NavBar() {
  return (
    <>
      <div className="w-full h-20 absolute z-10 p-8 flex flex-row justify-between items-center">
        <div className="flex flex-row justify-center items-center">
          <img src={LogoNoBg} alt="Logo" className="w-10 h-14" />
          <h1 className="font-bold text-3xl text-center ml-4">Aurelia Enterprises</h1>
        </div>
        <div className="flex flex-row gap-16">
          <p className="text-xl font-light"><CottageOutlinedIcon/><span className='ml-2'>Home</span></p>
          <p className="text-xl font-light"><InfoOutlinedIcon/><span className="ml-2">About</span></p>
          <p className="text-xl font-light"><ChatOutlinedIcon/><span className="ml-2">Communication</span></p>
          <p className="text-xl font-light"><HowToRegOutlinedIcon/><span className="ml-2">Login/Sign Up</span></p>
        </div>
      </div>
    </>
  );
}
