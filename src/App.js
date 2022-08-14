import './App.css';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useMoralis } from 'react-moralis';
import { useEffect } from 'react';
import cAbi from "./contractAbi.json";

const CONTRACT_ADDRESS="0x27ee472268D5B54BddC75827C68eB93c0Aec5223";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "prototypeBuild/Build/prototypeBuild.loader.js",
    dataUrl: "prototypeBuild/Build/prototypeBuild.data",
    frameworkUrl: "prototypeBuild/Build/prototypeBuild.framework.js",
    codeUrl: "prototypeBuild/Build/prototypeBuild.wasm",
  });

  const {isAuthenticated, user, authenticate, isWeb3Enabled,isWeb3EnableLoading, enableWeb3, authError, logout, Moralis} = useMoralis();

  useEffect(() => {
    if(!isWeb3Enabled && !isWeb3EnableLoading){
       (async () => {
        await enableWeb3()
       })()
    }
  },[isWeb3Enabled]);

  useEffect(() => {
    if(authError){
      alert(authError.message);
    }
  },[authError])

  const loginMetaMaskHandler = async () => {
    if(isWeb3EnableLoading){
      alert('Please login to your metamask wallet.')
      return;
    }else{
      if(!isWeb3Enabled){
        await enableWeb3();
      }
    }
  
    if(!isAuthenticated){
      await authenticate({signingMessage:"SignIn To DAPP"});
    }
  }
  
  const mintNow = async () => {
    if(!isAuthenticated){
      alert('Please login to your metamask wallet.');return;
    }
    const  options = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: "mint",
      abi: cAbi,
      params: {
        _to: user.attributes.ethAddress
      }
    }

    const txn  = await Moralis.executeFunction(options);
    console.log(txn.hash);

    await txn.wait(1);
  }
  return (
    <div className="App">
      <h1>React Unity NFT Test</h1>
      <div>
            <div>
              {(!isAuthenticated && !user)?
                 <button onClick={loginMetaMaskHandler}>Connect metamask</button>
                :
                <span onClick={logout}>{`${user.attributes.ethAddress.slice(0, 4)}...${user.attributes.ethAddress.slice(38)}`}</span>
              }  
            </div>

            <div>
              {(isAuthenticated && user) && <button onClick={mintNow}>Mint</button>}
            </div>
            <br/>
            <br/>
            <br/>
            <br/>

            <div>
              {(isAuthenticated && user)?
                <Unity unityProvider={unityProvider} style={{
                  width: "1500px",
                  height: "1090px"
                }}/>
              :''}
            </div>  



        </div>
    </div>
  );
}

export default App;
