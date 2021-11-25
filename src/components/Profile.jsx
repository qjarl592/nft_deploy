/** @jsx jsx */
import {css, jsx, keyframes} from "@emotion/react";
import React from 'react';
import { useEffect, useState} from "react";
import CreateNftForm from "./CreateNFTForm";
import {useRecoilState} from "recoil";
import {accountState} from "../state/state";
import Asset from "./Asset";

const profile= css`
	position: absolute;
	margin-top: 1em;
	left: 50%;
	transform: translate(-50%);
	width: 95%;
	background-color: white;
	box-shadow: 0px 0px 6px 6px rgba(217, 217, 217, 1);
	display: flex;
	flex-wrap: wrap;
	justify-content: left;
	align-content: stretch;
`
const nftButton = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: white;
	border: none;
	&:hover {
		opacity: 0.8;
		transform: scale(1.03);
	}
	list-style: none;
	img{
		width: 3em;
		padding-bottom: 2em;
	}
	span{
		color: gray;
	}
`
const nftContainer = css`
	display: flex;
	flex-direction: column;
	width: 260px;
	height: 390px;
	border: 3px dashed gray;
	border-radius: 1em;
	padding: 1.1em;
	margin-left: 1em;
	margin-top: 0.5em;
	margin-bottom: 1.5em;
	box-shadow: 0px 0px 6px 6px rgba(217, 217, 217, 1);
`

const Profile = ({contract, pinata, exchangeRate}) => {
	const [myAssets, setMyAssets]=useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [flag, setFlag] = useState(false);
	const [account, setAccount] = useRecoilState(accountState);

	const fetchPinned = async () => {
		const filter = {
			status: 'pinned',
			metadata: {
				keyvalues: {
					account: {
						value: account,
						op: 'eq'
					}
				}
			}
		}
		const tokens = await pinata.pinList(filter);
		setMyAssets(tokens.rows)
	}

	useEffect(()=>{
		setFlag(true)
	},[])

	useEffect(() => {
		fetchPinned()
		setFlag(false)
	},[account, flag]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return(
		<div css={profile}>
			<div css={nftContainer}>
				<button onClick={openModal} css={nftButton}>
					<img src="images/nftButton.png" alt="button"/>
					<span>아이템을 업로드하려면</span>
					<span>클릭하세요</span>
				</button>
			</div>
			<CreateNftForm isModalOpen={isModalOpen} closeModal={closeModal} setFlag={setFlag} contract={contract} pinata={pinata}/>
			{Object.keys(myAssets).map(key => (
				<Asset key={key} asset={myAssets[key]} contract={contract} pinata={pinata} setFlag={setFlag} exchangeRate={exchangeRate}/>
			))};
		</div>
	)
}

export default Profile;