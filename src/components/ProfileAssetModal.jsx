/** @jsx jsx */
import {css, jsx, keyframes} from "@emotion/react";
import React, {useRef, useState} from 'react';
import Modal from "react-modal";
import {Colors} from "../colors/Colors";
import {useRecoilState} from "recoil";
import {accountState} from "../state/state";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        width: `60vh`,
        height: '60vh',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
const assetInfo = css`
  display: flex;
  flex-direction: column;
  li{
    margin-left: 2em;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: left;
    span{
      font-size: 20px;
      margin: 5px 10px;
    }
  }
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
`
const audio = css`
	width: 340px;
`;
const buttonContainer = css`
  display: flex;
  justify-content: center;
  input {
    background: ${Colors.purple_key};
    width: 40%;
    color: #fff;
    border: none;
    margin: 10px;
    margin-top: 20px;
    height: 40px;
    border-radius: 1em;
    cursor: pointer;
    transition: 800ms ease all;
    outline: none;
    &:hover {
      background: #999999;
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
      }
`;
const floating = keyframes`
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
                `
const loader = css`
  z-index: 100;
  position: absolute;
  display: inline-block;
  top: 80%;
  left: 45%;
  border: 6px solid #f3f3f3; /* Light grey */
  border-top: 6px solid ${Colors.purple_key}; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${floating} 2s ease infinite;
`;
const input = css`
  width: 300px;
  height: 30px;
  border: none;
  border-bottom: 3px solid black;
`

const ProfileAssetModal = ({asset, isOpen, close, pinata, setFlag, contract, exchangeRate, baseURL}) =>{
    const [account, setAccount] = useRecoilState(accountState);
    const [loaderStyle, setLoaderStyle] = useState(false)

    const displayClass = loaderStyle? "inline" : "hidden"
    const {name} = asset.metadata
    const { image, author, description, price, state} = asset.metadata.keyvalues;
    const [selected, setSelected] = useState(state);
    const priceRef = useRef();
    const descriptionRef = useRef();
    const [won, setWon] = useState()
    

    const getWon = () => {
      const eth = Number(priceRef.current.value || '')
      console.log(eth)
      const wonPrice = Math.floor(eth*exchangeRate)
      setWon(wonPrice)
    }
    const onPublic = () => {
        setSelected("public")
    };

    const onPrivate = () => {
       setSelected("private")
    };


    const updateToken = async () => {
      setLoaderStyle(true)
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
  
          try{
              await pinata.hashMetadata(asset.ipfs_pin_hash, newMeta)
              setFlag(true)
          }
          catch(error){
              console.log(error)
          }
          setLoaderStyle(false)
      close()
    }

    const deleteToken = async () => {
      setLoaderStyle(true)
      try{
          const tokenID = asset.metadata.keyvalues.tokenID
          const tokenImage = asset.metadata.keyvalues.image
          const imagePath = tokenImage.replace('https://gateway.pinata.cloud/ipfs/','')
          await contract.methods.burn(tokenID).send({ from: account })
          await pinata.unpin(asset.ipfs_pin_hash)
          await pinata.unpin(imagePath)
          setFlag(true)
      }
      catch(error) {
          console.log(error)
      }
      setLoaderStyle(false)
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
                <div css={loader} id={displayClass}/>
                <ul css={assetInfo}>
                    <img src={image} alt="asset"/>
                    <audio css={audio} controls className="audio">
                        <source src={baseURL + asset.ipfs_pin_hash}/>
                    </audio>
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
                        <input type="text" css={input} defaultValue={description} ref={descriptionRef}/>
                    </li>
                    <br/>
                    <li>
                        <span>공개여부</span>
                        <input type="radio" id="public" name="drone" value="public" checked={selected === "public"} onChange={onPublic}/>
                        <label htmlFor="Public">공개</label>
                        <input type="radio" id="private" name="drone" value="private" checked={selected === "private"} onChange={onPrivate}/>
                        <label htmlFor="Private">비공개</label>
                    </li>
                    <li>
                        {
                            selected === "public" &&
                            <div>
                              <span>가격</span>
                              <input type="text" ref = {priceRef} defaultValue={price} onChange={getWon}/>
                              <span> (Approx. {won} 원)</span>
                            </div>
                        }
                    </li>
                    <div css={buttonContainer}>
                        <input onClick={updateToken} type="button" id="update" value="수정하기"/>
                        <input onClick={deleteToken} type="button" id="delete" value="삭제하기"/>
                    </div>
                </ul>
            </Modal>
        </div>
    );
}


export default ProfileAssetModal;