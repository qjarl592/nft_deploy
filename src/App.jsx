/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import React, { useEffect, useState} from "react";
import ERC_721 from "./contracts/ERC721.json";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Market from './components/Market';
import Layout from './components/Layout';
import Profile from './components/Profile';
import Wallet from "./components/Wallet";
import getWeb3 from "./service/getWeb3";
import {useRecoilState} from "recoil";
import {accountState} from "./state/state";

const app=css`
  height: 100vh;
`

const pinataSDK = require('@pinata/sdk');
const pinataObj = pinataSDK(process.env.REACT_APP_PINATA_API_KEY, process.env.REACT_APP_PINATA_SECRET_KEY);

const App = () => {
    const [account, setAccount] = useRecoilState(accountState);
    const [ERC721Contract, setERC721Contract] = useState();
    const [pinata, setPinata] = useState(pinataObj)
    const [exchangeRate, setExchangeRate] = useState()

    useEffect(()=>{
        connectWeb3();
        getRate()
    },[])

    const getRate = async () => {
		const response = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
		const result = await response.json(); 
		const eth = Number(result.rates.eth.value)
		const krw = Number(result.rates.krw.value)
		const rate = krw/eth
		setExchangeRate(rate)
	}

    const connectWeb3 =async ()=>{
        try{
            console.time("calculatingTime")
            const web = await getWeb3();
            const accounts = await web.eth.getAccounts();
            const networkId = await web.eth.net.getId();
            const deployedNetwork = ERC_721.networks[networkId];
            const ERC721 = await new web.eth.Contract(
                ERC_721.abi,
                deployedNetwork && deployedNetwork.address,
            );
            console.timeEnd("calculatingTime")
            setAccount(accounts[0]);
            setERC721Contract(ERC721);
        }catch(error){
            console.log(error);
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
        }
    }

    return(
        <div css={app} className="App">
            <Router>
                <Switch>
                        <Layout>
                            <Route exact path="/" render ={
                                props =>  <Market {...props} exchangeRate={exchangeRate} contract={ERC721Contract} pinata={pinata}  />}>
                            </Route>
                            <Route exact path="/profile" render={
                                props => <Profile {...props} exchangeRate={exchangeRate} contract={ERC721Contract} pinata={pinata}/>} />
                            <Route exact path='/wallet' render={
                                props => <Wallet {...props} connectWeb3={connectWeb3}/>} />
                        </Layout>
                </Switch>
            </Router>
        </div>
    )
}

export default App;