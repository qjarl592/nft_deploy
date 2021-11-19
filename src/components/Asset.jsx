/** @jsx jsx */
import React, { useState } from 'react';
import AssetModal from './AssetModal';
import { css, jsx } from '@emotion/react'
import {useHistory} from "react-router-dom";
import ProfileAssetModal from "./ProfileAssetModal";

const info = css`
	padding: 0.5em;
	.price{
		font-size: 0.6rem;
		color: gray;
	}
`
const nameAudio = css`
	display: flex;
	align-items: center;
	.name {
		flex: 2;
		margin-right: 5px;
	}
	.audio {
		flex: 8;
		height: 2em;
	}
`
const assetStyle = css`
	&:hover {
		opacity: 0.8;
		transform: scale(1.03);
	}
	list-style: none;
	width: 260px;
	height: 350px;
	padding: 1.2em;
	border-radius: 1em;
	box-shadow: 4px 2px 4px 2px rgba(217, 217, 217, 217);
	img{
		border-radius: 0.5em;
		object-fit: contain;
		width: 100%;
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

const Asset = ({asset, contract, pinata, setFlag, exchangeRate}) => {
	const baseURL = 'https://gateway.pinata.cloud/ipfs/';
	const {name} = asset.metadata
	const { price} = asset.metadata.keyvalues;
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
			<img src={asset.metadata.keyvalues.image} alt="asset" onClick={openModal}/>
			{
				pathname === "/profile"
					? <ProfileAssetModal asset={asset} contract={contract} isOpen={isModalOpen} close={closeModal} pinata={pinata} setFlag={setFlag}/>
					: <AssetModal asset={asset} contract={contract} isOpen={isModalOpen} close={closeModal} pinata={pinata}/>
			}
			<div css={info}>
				<div css={nameAudio}>
					<span className="name">{name}</span>
					<audio controls className="audio">
						<source src={baseURL + asset.ipfs_pin_hash}/>
					</audio>
				</div>
				<span className="price">{price} ETH (Approx. {Math.floor(Number(asset.metadata.keyvalues.price)*exchangeRate)} 원)</span>
			</div>
		</li>
	);
}

export default Asset;