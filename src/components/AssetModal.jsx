/** @jsx jsx */
import {css,jsx} from "@emotion/react";
import React from 'react';
import {useRecoilState} from "recoil";
import {accountState} from "../state/state";
import Modal from 'react-modal';
import './AssetModal.css';
import {Colors} from "../colors/Colors";

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: `80vh`,
		height: '60vh',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

const modalContent = css`
	list-style: none;
`
const purchaseButton = css`
	background-color: ${Colors.purple_key};
	width: 50vh;
	height: 4vh;
`

const AssetModal = ({asset, contract, pinata, isOpen, close, exchangeRate}) => {
	const {name} = asset.metadata
	const { author, description, price} = asset.metadata.keyvalues;
	const [account, setAccount] = useRecoilState(accountState);

	const buyToken = async () => {
		const seller = asset.metadata.keyvalues.account
		const tokenID = asset.metadata.keyvalues.tokenID
		const price = asset.metadata.keyvalues.price

		await contract.methods.purchase(account,seller,tokenID).send({ from: account, value: (price*1e18)})

		const updateAccount = {
			keyvalues: {
				account: account
			}
		}
		await pinata.hashMetadata(asset.ipfs_pin_hash, updateAccount)
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
				<ul css={modalContent}>
					<li>
						<span>세부정보</span>
					</li>
					<li><span>제목: </span>
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
				</ul>
				<input css={purchaseButton} type="button" id="buy" value="구매하기" onClick={buyToken}/>
		</Modal>
	)
}
Modal.setAppElement('#root')
export default AssetModal;