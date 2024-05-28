import { useLocation, Link, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { navigation } from "../constants/data";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import HealthContract from "../abis/Health_Contract.json";
import { useUser } from "../UserContext";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const { account, setAccount, contract, setContract } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        setAccount(account);
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "0x"; 
        const contract = new ethers.Contract(contractAddress, HealthContract.abi, signer);
        setContract(contract);
      } else {
        alert("MetaMask extension not detected. Please install MetaMask.");
      }
      
      // navigate("/user");
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
    // if(signer !== "0x"){
    //   navigate("/admin")
    // }else{
    //   navigate("/user");
    // }
    navigate("/user");
  };

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            const account = accounts[0];
            setAccount(account);
            setIsConnected(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractAddress = "0x";
            const contract = new ethers.Contract(contractAddress, HealthContract.abi, signer);
            setContract(contract);
          } else {
            setIsConnected(false);
            setAccount("");
          }
        } else {
          setIsConnected(false);
          setAccount("");
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error);
        setIsConnected(false);
        setAccount("");
      }
    };

    checkConnection();
    window.ethereum.on("accountsChanged", (accounts) => {
      checkConnection();
    });
  }, [setIsConnected, setAccount]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-8" href="#hero">
          <h1 className="h1 text-4xl text-color-4">MediByte</h1>
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-sm lg:font-semibold ${
                  item.url === pathname.hash ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>

          <HamburgerMenu />
        </nav>

        <a
          href="#signup"
          className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
        >
          New account
        </a>

        <Button
          onClick={isConnected ? null : connectWallet}
          className={`relative inline-block text-lg group lg:inline-block hidden ${
            isConnected ? "cursor-default" : ""
          }`}
        >
          {isConnected ? (
            <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-green-500 border-2 border-green-500 rounded-lg">
              <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
              <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
              <span className="relative font-black text-sm">
                Connected: {`${account.substring(0, 3)}...${account.slice(-3)}`}
              </span>
            </span>
          ) : (
            <>
              <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                <span className="relative font-black text-sm">Connect your wallet</span>
              </span>
              <span
                className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-green-400 rounded-lg group-hover:mb-0 group-hover:mr-0"
                data-rounded="rounded-lg"
              ></span>
            </>
          )}
        </Button>

        <Button className="ml-auto lg:hidden" px="px-3" onClick={toggleNavigation}>
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
