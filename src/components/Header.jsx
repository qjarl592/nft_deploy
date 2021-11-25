/** @jsx jsx */
import React, { useRef } from 'react'
import {css, jsx } from '@emotion/react'
import { useHistory } from 'react-router-dom'
import {useRecoilState, useRecoilValue} from 'recoil';
import {accountState, keywordState} from '../state/state';
import getWeb3 from "../service/getWeb3";



const header= css`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 150px;
	box-shadow: 0px 0px 6px 6px rgba(217, 217, 217, 1);
`

const logo=css`
	object-fit: contain;
	width: 15%;
	padding: 2em;
`

const buttons=css`
	display: flex;
	list-style:none;
	margin-right: 90px;
	li {
		background-color: #F8F9FA;
		border: 1px black solid;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		margin: 6px;
		button{
			border: none;
			background-color: gray;
			padding: 0px;
		}
		img{
			background-color: #F8F9FA;
			vertical-align: middle;
			width: 25px;
			height: 25px;
		}
	}
`

const searchWindow =css`
	display: flex;
	background-color: white;
	width: 700px;
	height: 40px;
	border-radius: 24px;
	border: 1px black solid;
	align-items: center;

	input {
		border: none;
		width: 100%;
		&:focus {
			outline: none;
		}
	}
	img {
		margin: auto 1.5em auto 1em;
		width: 20px;
		height: 20px;
	}
`

const Header = () => {

    const [account, setAccount] = useRecoilState(accountState);
	const [keyword, setKeyword] = useRecoilState(keywordState)
	const keywordRef = useRef()

	let history= useHistory();
	const goProfile=async()=>{
		const web3 = await getWeb3()
		const curAccounts = await web3.eth.getAccounts();
		const curAccount = curAccounts[0]
		if(account===curAccount){
			history.push("/profile")
		}else{
			history.push("/wallet");
		}
	}
	const onKeyPress = (event) => {
		if (event.key === 'Enter'){
			search();
		}
	}
	const onClick =()=>{
		search()
	}
	const search = (event) => {
		setKeyword(keywordRef.current.value);
		history.push("/");
	};

	const onLogo = () => {
		keywordRef.current.value = ''
		setKeyword(keywordRef.current.value);
		history.push("/")
	};

	const goWallet=()=>{
		history.push("/Wallet")
	}

	return(
		<div css={header} className="app-header">
			<img src="images/Logo.png" alt="" onClick={onLogo} css={logo}/>
			<div css={searchWindow}>
				<img src="images/SVG/Search.svg" alt="" onClick={onClick}/>
				<input ref ={keywordRef} id="input" type="text" onKeyDown={onKeyPress} />
			</div>
			<ul css={buttons}>
				<li className="profile"><button onClick={goProfile}><img src="images/SVG/Profile.svg" alt="" /></button></li>
				<li className="wallet"><button onClick={goWallet}><img src="images/SVG/Wallet.svg" alt="" /></button></li>
			</ul>
		</div>
	)
};

export default Header
