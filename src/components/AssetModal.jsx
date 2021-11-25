/** @jsx jsx */
import {css, jsx, keyframes} from "@emotion/react";
import React, {useState} from 'react';
import {useRecoilState} from "recoil";
import {accountState} from "../state/state";
import Modal from 'react-modal';
import './AssetModal.css';
import {Colors} from "../colors/Colors";
import {useHistory} from "react-router-dom";
import getWeb3 from "../service/getWeb3";


const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: `60vh`,
		height: '70vh',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)',
	},
};
const info= css`
	margin-top: 10px;
`

const modalContent = css`
	list-style: none;
	display: flex;
	flex-direction: column;
	justify-content: center;
	img{
		margin: auto;
		border-radius: 0.5em;
		object-fit: contain;
		width: 80%;
		padding: 0.5em;
	}
	audio{
		margin: auto;
	}
	li{
		margin-left: 2em;
		text-align: center;
		display: flex;
		justify-content: left;
		span{
			font-size: 20px;
			margin: 5px 10px;
		}
	}
`
const purchaseButton = css`
	background: ${Colors.purple_key};
	color: #fff;
	border: none;
	margin: auto;
	margin-top: 20px;
	height: 40px;
	border-radius: 1em;
	width: 85%;
	padding: 0 2em;
	cursor: pointer;
	transition: 800ms ease all;
	outline: none;
	&:hover {
		background:  #999999;
		color: white;
	}
	&:before, button:after {
		content: '';
		top: 0;
		right: 0;
		height: 2px;
		width: 0;
		background: white;
		transition: 400ms ease all;
		&:after {
			right: inherit;
			top: inherit;
			left: 0;
			bottom: 0;
		}
		&:hover:before, button:hover:after {
			width: 100%;
			transition: 800ms ease all;
`
const audio = css`
	width: 340px;
`;
const floating = keyframes`
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
`
const loader = css`
  z-index: 100;
  position: absolute;
  display: inline-block;
  top: 45%;
  left: 45%;
  border: 6px solid #f3f3f3; /* Light grey */
  border-top: 6px solid ${Colors.purple_key}; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${floating} 2s ease infinite;
`;

const AssetModal = ({baseURL, asset, contract, pinata, isOpen, close, exchangeRate, setMkFlag}) => {
	const {name} = asset.metadata
	const { image,author, description, price} = asset.metadata.keyvalues;
	const [account, setAccount] = useRecoilState(accountState);
	const [loaderStyle, setLoaderStyle] = useState(false)
	const displayClass = loaderStyle? "inline" : "hidden"
	const history = useHistory();

	const buyToken = async () => {
		setLoaderStyle(true)
		const seller = asset.metadata.keyvalues.account
		const tokenID = asset.metadata.keyvalues.tokenID
		const price = asset.metadata.keyvalues.price
		try{
			await contract.methods.purchase(account,seller,tokenID).send({ from: account, value: (price*1e18)})
			const updateAccount = {
				keyvalues: {
					state: 'private',
					account: account,
					price: null,
				},
			}
			await pinata.hashMetadata(asset.ipfs_pin_hash, updateAccount)
			setMkFlag(true)
		}
		catch(error) {
			console.log(error)
		}
		setLoaderStyle(false)
		close()
	};

	return (
		<Modal
			overlayClassName="overlay"
			isOpen={isOpen}
			style={customStyles}
			onRequestClose={close}
			contentLabel="Example Modal"
		>
			<div css={loader} id={displayClass}/>
				<ul css={modalContent}>
					<img src={image} alt="asset"/>
					<audio css={audio} controls className="audio">
						<source src={baseURL + asset.ipfs_pin_hash}/>
					</audio>
					<li css={info}>
						<span>세부정보</span>
					</li>
					<li>
						<span>제목: </span>
						<span>{name}</span>
					</li>
					<li>
						<span>아티스트: </span>
						<span>{author}</span>
					</li>
					<li>
						<span>설명: </span>
						<span>{description}</span>
					</li>
					<li>
						<span>가격: </span>
						<span>{price}</span>
						<span> (Approx. {Math.round(price*exchangeRate)} 원)</span>
					</li>
					<input css={purchaseButton} type="button" id="buy" value="구매하기" onClick={buyToken}/>
				</ul>
		</Modal>
	)
}
Modal.setAppElement('#root')
export default AssetModal;