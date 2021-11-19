/** @jsx jsx */
import Modal from 'react-modal';
import React, {useRef, useState} from 'react';
import {css, jsx} from "@emotion/react";
import './Modal.css';
import {create} from "ipfs-http-client";
import {accountState} from "../state/state";
import {useRecoilState} from "recoil";

const modalContainer = css`
  display: flex;
  flex-direction: column;
  list-style: none;
  justify-content: center;
  align-content: center;
  li{
    font-size: 20px;
    padding: 10px;
  }
`

const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

const CreateNftForm = ({isModalOpen, closeModal, setFlag, contract, pinata}) => {
    const [account, setAccount] = useRecoilState(accountState);
    const [audioBuffer, setAudioBuffer] = useState();
    const [imageBuffer, setImageBuffer] = useState();

    const audioCapture = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setAudioBuffer(Buffer(reader.result));
        }
    }

    const imageCapture = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setImageBuffer(Buffer(reader.result));
        }
    }

    const titleRef= useRef();
    const authorRef = useRef();
    const descriptionRef= useRef();

    const createToken = async () => {
        const myImageResult=await ipfs.add(imageBuffer);
        await pinata.pinByHash(myImageResult.path);

        const options={
            pinataMetadata: {
                name: titleRef.current.value || '',
                keyvalues: {
                    author: authorRef.current.value || '',
                    description: descriptionRef.current.value || '',
                    image: 'https://gateway.pinata.cloud/ipfs/'+myImageResult.path,
                    state: 'private',
                    account: account,
                },
            },
        }
        
        const myAssetResult = await ipfs.add(audioBuffer);
        const pinataResult = await pinata.pinByHash(myAssetResult.path, options);

        const nft = await contract.methods.mint(account, pinataResult.ipfsHash).send({ from: account });
		const tokenID = nft.events.Transfer.returnValues.tokenId

        const updateID = {
			keyvalues: {
				tokenID: tokenID,
			},
		}
		await pinata.hashMetadata(myAssetResult.path, updateID)
        setFlag(true)
        closeModal()
    };

    return(
        <div>
            <Modal
                className ="Modal"
                overlayClassName="overlay"
                isOpen={isModalOpen}
                onRequestClose={closeModal}
            >
                <ul css={modalContainer}>
                    <li >NFT 생성하기</li>
                    <li>오디오 업로드</li>
                    <input type="file" id="setAudio" onChange={audioCapture}/>
                    <li>프리뷰 업로드</li>
                    <li><span>업로드한 아이템을 설명할 수 있는 이미지를 업로드하세요.(PNG,JPG,GIF)</span></li>
                    <input type="file" id="setImage" onChange={imageCapture}/>
                    <li>제목</li>
                    <input ref={titleRef} type="text" id="setTitle" size="71" placeholder="아이템 제목을 입력해주세요."/>
                    <li>아티스트</li>
                    <input ref={authorRef} type="text" id="setAuthor" size="71" placeholder="아티스트를 입력해주세요."/>
                    <li>설명</li>
                    <textarea ref={descriptionRef} id="setDescription" cols="63" rows="10" placeholder="아이템에 대한 추가적인 설명을 작성해주세요."/>
                    <input type="button" id="create" value="업로드하기" onClick={createToken}/>
                </ul>
            </Modal>
        </div>
    )
}

export default CreateNftForm;