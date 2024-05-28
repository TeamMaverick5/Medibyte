import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Navigate } from 'react-router-dom';

const PatientNFT_ADDRESS = "0xYourPatientNFTContractAddress";
const PatientNFT_ABI = [
  "function getTokenId(address _owner) view returns (uint256)"
];

const getNFTId = async (provider, walletAddress) => {
  const contract = new ethers.Contract(PatientNFT_ADDRESS, PatientNFT_ABI, provider);
  const tokenId = await contract.getTokenId(walletAddress);
  return tokenId.toNumber(); 
};

const fetchNFTDataFromOpenSea = async (tokenId) => {
  const response = await fetch(`https://api.opensea.io/api/v1/asset/${PatientNFT_ADDRESS}/${tokenId}/`);
  const data = await response.json();
  return data;
};

const ProfileCard = () => {
  const [nftData, setNftData] = useState({
    image_url: "https://via.placeholder.com/500", 
    image_preview_url: "https://via.placeholder.com/100", 
    attributes: [
      { trait_type: 'Coins', value: '-' },
      { trait_type: 'Rewards', value: '-' },
      { trait_type: 'Tests', value: '-' },
    ],
    name: "No NFT Data",
  });
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchNFTData = async () => {
      if (!window.ethereum) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        setAccount(account);

        const tokenId = await getNFTId(provider, account);
        if (!tokenId) {
          setLoading(false);
          return;
        }
        const data = await fetchNFTDataFromOpenSea(tokenId);
        setNftData(data);
      } catch (error) {
        console.error("Error fetching NFT data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTData();
  }, []);

  const RewardLink = () => {
    Navigate("/Rewards",{
        state: {
            PatientNFTAddress: PatientNFT_ADDRESS,
            NFTId: getNFTId 
        }
    })
  }

  const coins = nftData.attributes.find(attr => attr.trait_type === 'Coins') || { value: '-' };
  const rewards = nftData.attributes.find(attr => attr.trait_type === 'Rewards') || { value: '-' };
  const tests = nftData.attributes.find(attr => attr.trait_type === 'Tests') || { value: '-' };

  return (
    <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
      <div className="rounded-t-lg h-32 overflow-hidden">
        <img className="object-cover object-top w-full" src={nftData.image_url} alt={nftData.name} />
      </div>
      <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img className="object-cover object-center h-32" src={nftData.image_preview_url} alt={nftData.name} />
      </div>
      <div className="text-center mt-2">
        <h2 className="font-semibold">{account? `${account.substring(0, 5)}...${account.slice(-3)}` : "0x"}</h2>
      </div>
      <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
        <li className="flex flex-col items-center justify-around">
          <svg className="w-6 h-6 fill-current text-black-900" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V304v5.7V336zm32 0V304 278.1c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5V272c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V432c0 44.2-86 80-192 80S0 476.2 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z"/></svg>

          <span>{coins.value}</span>
        </li>
        <li className="flex flex-col items-center justify-around">
          <svg className="w-6 h-6 fill-current text-black-900" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M96 352V96c0-35.3 28.7-64 64-64H416c35.3 0 64 28.7 64 64V293.5c0 17-6.7 33.3-18.7 45.3l-58.5 58.5c-12 12-28.3 18.7-45.3 18.7H160c-35.3 0-64-28.7-64-64zM272 128c-8.8 0-16 7.2-16 16v48H208c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V256h48c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H320V144c0-8.8-7.2-16-16-16H272zm24 336c13.3 0 24 10.7 24 24s-10.7 24-24 24H136C60.9 512 0 451.1 0 376V152c0-13.3 10.7-24 24-24s24 10.7 24 24l0 224c0 48.6 39.4 88 88 88H296z"/></svg>

          <span>{rewards.value}</span>
        </li>
        <li className="flex flex-col items-center justify-around">
          <svg className="w-6 h-6 fill-current text-black-900" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M96 352V96c0-35.3 28.7-64 64-64H416c35.3 0 64 28.7 64 64V293.5c0 17-6.7 33.3-18.7 45.3l-58.5 58.5c-12 12-28.3 18.7-45.3 18.7H160c-35.3 0-64-28.7-64-64zM272 128c-8.8 0-16 7.2-16 16v48H208c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V256h48c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H320V144c0-8.8-7.2-16-16-16H272zm24 336c13.3 0 24 10.7 24 24s-10.7 24-24 24H136C60.9 512 0 451.1 0 376V152c0-13.3 10.7-24 24-24s24 10.7 24 24l0 224c0 48.6 39.4 88 88 88H296z"/></svg>

          <span>{tests.value}</span>
        </li>
      </ul>
      <div className="p-4 border-t mx-8 mt-2">
        <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-0 py-2" onClick={RewardLink} >Get Rewards</button>
      </div>
    </div>
  );
};

export default ProfileCard;
