/** @jsx jsx */
import React, { useState } from 'react';
import AssetModal from './AssetModal';
import { css, jsx } from '@emotion/react'
import {useHistory} from "react-router-dom";
import ProfileAssetModal from "./ProfileAssetModal";

const assetStyle = css`
	list-style: none;
	width: 230px;
	height: 350px;
	box-shadow: 6px 0px 6px 2px rgba(217, 217, 217, 1);
	img{
		object-fit: contain;
		width: 100%;
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
			<div className="info">
				<h2 onClick={openModal}>{asset.metadata.name}</h2>
				<audio controls>
					<source src={baseURL + asset.ipfs_pin_hash}/>
				</audio>
				<h3>{asset.metadata.keyvalues.price} ETH (Approx. {Math.floor(Number(asset.metadata.keyvalues.price)*exchangeRate)} 원)</h3>
			</div>
		</li>
	);
}

export default Asset;