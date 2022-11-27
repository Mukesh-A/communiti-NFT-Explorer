import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Alchemy, Network } from 'alchemy-sdk';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useAccount,useContract, useProvider, useSigner } from 'wagmi';
import NFTCrad from '../src/NFTCrad';
import styles from '../styles/Home.module.css';
import { create } from 'ipfs-http-client'
import { json } from 'stream/consumers';




const Home: NextPage = () => {
 
  const { address, isConnected } = useAccount();

  const [alchemy,setAlchemy]:any = useState(null);

  const [nfts, setNfts]:any = useState([]); 
  const [openForm, setOpenForm]:any = useState(false); 

  const [title,setTitle] =useState("");
  const [description,setdescription] =useState("");
  const [image,setImage] =useState("");
  const {data:signer, isError, isLoading} = useSigner();
 
  const nftAddress = "0x98b0118d38cd3eeacdeac8cf66f3de6ede3989cb";

const ABI = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":false,"internalType":"bool","name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_approved","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_tokenURI","type":"string"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"payable","type":"function"}]
  
const contract = useContract({
  address:nftAddress,
  abi:ABI,
  signerOrProvider:signer,
});

  useEffect(()=>{
    const settings = {
      apiKey: "lmr38bBwfCgF2dTpxOAnRnvHi5-BfDWG", 
      network: Network.ETH_GOERLI, 
    };

    const alchemy = new Alchemy(settings);
    setAlchemy(alchemy);

  },[]);


  useEffect(()=>{
    if(isConnected && alchemy && address){
      fetchNFTs(address);
    }
  },[isConnected,alchemy,address])

  async function fetchNFTs(address :string){
    //https://docs.alchemy.com/reference/getnfts
    //getNftsForOwner => Gets all NFTs currently owned by a given address.
    const nftsForOwner = await alchemy.nft.getNftsForOwner(address);
    for(let index= 0;index<nftsForOwner?.ownedNfts.length;index++){
      let currentNFT = nftsForOwner?.ownedNfts[index];
      const metadata = await axios(currentNFT?.tokenUri?.raw);
      nftsForOwner.ownedNfts[index].metadata = metadata.data;
    }

    setNfts(nftsForOwner.ownedNfts);
    console.log(nftsForOwner.ownedNfts);
  }
  //
  const uploadImage = async(e:any)=>{
    const auth ="Basic " +  Buffer.from("2HdPEYfHzP44kUkXsenWNRU1QjC" + ":" + "39e7fce4d903c8bf38235119160b3c1c").toString("base64");
    
    console.log(e.target.files[0]);
    const client = create({ url: "https://ipfs.infura.io:5001",headers:{
      authorization:auth,
    } });
    const response = await client.add(e.target.files[0]);
    setImage(`https://ipfs.io/ipfs/${response.path}`)
    console.log(client,response);

  }
  const createNFT = async ()=>{
    if(!title || !description || !image){
      alert("fields are required");
    }
    const metadata:any = {
      title,
      description,
      image,
    };
    console.log(metadata);

    const auth ="Basic " +  Buffer.from("2HdPEYfHzP44kUkXsenWNRU1QjC" + ":" + "39e7fce4d903c8bf38235119160b3c1c").toString("base64");
    
    // console.log(e.target.files[0]);
    const client = create({ url: "https://ipfs.infura.io:5001",headers:{
      authorization:auth,
    } });
    const response = await client.add(JSON.stringify(metadata))
    console.log(response, "metadata");
    
    console.log(contract);
    const transaction = await contract?.mint(`https://ipfs.io/ipfs/${response.path}`);
    console.log(transaction);

  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>RainbowKit App</title>
        <meta
          name="description"
          content="Generated by @rainbow-me/create-rainbowkit"
        />
       
      </Head>
      <main className={styles.main}>
        <ConnectButton />
       <Button onClick={()=>setOpenForm(true)}>Create NFT</Button>
      </main>

      {openForm ?<div className={styles.formfield}>
        <h2>Create Your NFT</h2>

        <TextField className={styles.textfield} id="outlined-basic" label="Title" variant="outlined" onChange={(e)=>setTitle(e.target.value)}/>

        <TextField className={styles.textfield} multiline id="outlined-basic" label="Description" variant="outlined"
        onChange={(e)=>setdescription(e.target.value)}/>

        <input className={styles.textfield} type="file" id="nft" name="nft" accept="image/png, image/jpeg" onChange={(e)=>uploadImage(e)}/>

        <Button sx={{mt:2}} variant='contained' onClick={createNFT}>Deploy your NFT</Button>
      </div>: <div className={styles.main_content}>
        {nfts.length ? nfts?.map((nft:any,index:any)=>(
          
          <div  key={index}>
           <NFTCrad nft={nft} key={index}/>
          </div> 
        )): <div>No NFT Available</div>}

      </div>}
    </div>
  );
};

export default Home;
