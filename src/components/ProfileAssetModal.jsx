/** @jsx jsx */
import {css,jsx} from "@emotion/react";
import React, {useRef, useState} from 'react';
import Modal from "react-modal";
import {Colors} from "../colors/Colors";
import {useRecoilState} from "recoil";
import {accountState} from "../state/state";

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
const editButton = css`
	background-color: ${Colors.purple_key};
	width: 50vh;
	height: 4vh;
`
const assetInfo = css`
  li{
    list-style: none;
  }
`
const ProfileAssetModal = ({asset, isOpen, close, pinata, setFlag, contract}) =>{
    const [account, setAccount] = useRecoilState(accountState);

    const {name} = asset.metadata
    const { author, description, price, state} = asset.metadata.keyvalues;
    const [selected, setSelected] = useState(state);
    const priceRef = useRef();
    const descriptionRef = useRef();

    const onPublic = () => {
        setSelected("public")
    };

    const onPrivate = () => {
       setSelected("private")
    };


    const updateToken = async () => {
		console.log('update click')
		const newDescription = descriptionRef.current.value || ''
		const newState = selected

		const newMeta = {
			keyvalues: {
				description: newDescription,
                state: newState,
                price: null
			}
		}

		if(newState == 'public') {
            const newPrice = priceRef.current.value || ''
			newMeta['keyvalues']['price'] = newPrice
		}

		await pinata.hashMetadata(asset.ipfs_pin_hash, newMeta)
		setFlag(true)
		close()
	}

	const deleteToken = async () => {
		console.log('delete click')
		const tokenID = asset.metadata.keyvalues.tokenID
		await contract.methods.burn(tokenID).send({ from: account })
		await pinata.unpin(asset.ipfs_pin_hash)
		setFlag(true)
		close()
	}

    return (
        <div>
            <Modal
                overlayClassName="overlay"
                isOpen={isOpen}
                style={customStyles}
                onRequestClose={close}
                contentLabel="Example Modal"
            >
                <ul css={assetInfo}>
                    <li>
                        <span>세부정보</span>
                    </li>
                    <li>
                        <span>제목:</span>
                        <span>{name}</span>
                    </li>
                    <li>
                        <span>아티스트:</span>
                        <span>{author}</span>
                    </li>
                    <li>
                        <span>설명:</span>
                        <input type="text" defaultValue={description} ref={descriptionRef}/>
                    </li>
                    <br/>
                    <li>
                        <span>공개여부</span>
                        <input type="radio" id="public" name="drone" value="public" checked={selected === "public"} onChange={onPublic}/>
                        <label htmlFor="Public">Public</label>
                        <input type="radio" id="private" name="drone" value="private" checked={selected === "private"} onChange={onPrivate}/>
                        <label htmlFor="Private">Private</label>
                    </li>
                    <li>
                        {
                            selected === "public" &&
                            <div>
                                <span>가격</span>
                                <input type="text" ref = {priceRef} defaultValue={price}/>
                            </div>
                        }
                    </li>
                    <input css={editButton} onClick={updateToken} type="button" id="update" value="수정하기"/>
                    <input css={editButton} onClick={deleteToken} type="button" id="delete" value="삭제하기"/>
                </ul>
            </Modal>
        </div>
    );
}


export default ProfileAssetModal;