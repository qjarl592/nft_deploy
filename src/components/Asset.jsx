/** @jsx jsx */
import React, { useState } from 'react';
import AssetModal from './AssetModal';
import { css, jsx } from '@emotion/react'
import {useHistory} from "react-router-dom";
import ProfileAssetModal from "./ProfileAssetModal";

const info = css`
	padding: 0.5em;
	.price{
		font-size: 1rem;
		color: gray;
		margin-left:0.5em
	}
`
const nameAudio = css`
	align-items: center;
	.audio {
		width: 100%;
		height: 2em;
	}
	.name {
		margin-left: 0.5em;
		font-size: 17px;
		font-weight: bold;
	}
`

const assetStyle = css`
	&:hover {
		opacity: 0.8;
		transform: scale(1.03);
	}
	list-style: none;
	width: 260px;
	height: 390px;
	padding: 1.3em;
	margin-left: 3em;
	margin-top: 2em;
	margin-bottom: 1.5em;
	border-radius: 1em;
	box-shadow: 0px 0px 6px 6px rgba(217, 217, 217, 1);
	img{
		border-radius: 0.5em;
		object-fit: contain;
		width: 250px;
		height: 260px;
		padding: 0.5em;
	}
	.info{
		h2{
			font-size: 1.0rem
		}
		h3{
			font-size:0.8rem
		}
	}
`

const Asset = ({asset, contract, pinata, setFlag, exchangeRate, setMkFlag, baseURL}) => {
	const {name} = asset.metadata
	const { price, image } = asset.metadata.keyvalues;
	const [isModalOpen, setIsModalOpen] = useState(false); //모달창이 열렸는가?
	let history = useHistory();
	const {pathname} = history.location;
	const openModal = () => {
	  setIsModalOpen(true);
	};

	const closeModal = () => {
	  setIsModalOpen(false);
	};

	return (
		<li css={assetStyle} className="asset">
			<img src={image} alt="asset" onClick={openModal}/>
			{
				pathname === "/profile"
					? <ProfileAssetModal asset={asset} contract={contract} isOpen={isModalOpen} close={closeModal} pinata={pinata} setFlag={setFlag} exchangeRate={exchangeRate} baseURL={baseURL}/>
					: <AssetModal asset={asset} contract={contract} isOpen={isModalOpen} close={closeModal} pinata={pinata} exchangeRate={exchangeRate} setMkFlag={setMkFlag} baseURL={baseURL}/>
			}
			<div css={info}>
				<div css={nameAudio}>
					<audio controls className="audio">
						<source src={baseURL + asset.ipfs_pin_hash}/>
					</audio>
					<span className="name">{name}</span>
				</div>
				{
					price && <span className="price">{price} ETH (Approx. {Math.floor(Number(price)*exchangeRate)} 원)</span>
				}
			</div>
		</li>
	);
}

export default Asset;