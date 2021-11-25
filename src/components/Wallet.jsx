/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import React from 'react';
import { useRecoilState } from 'recoil';
import {accountState} from "../state/state";
import {useHistory} from "react-router-dom";
import getWeb3 from "../service/getWeb3";

const walletStyle =css`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  width: 30%;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  background-color: white;
  span{
    text-align: center;
  }
`
const back= css`
	position: absolute;
	margin-top: 1em;
	left: 50%;
	transform: translate(-50%);
	width: 95%;
	height: 100%;
	background-color: white;
	box-shadow: 0px 0px 6px 6px rgba(217, 217, 217, 1);
`
const Button = css`
  background: #333333;
  color: #fff;
  border: none;
  margin: auto;
  margin-top: 20px;
  height: 40px;
  width: 80%;
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
`;

const Wallet = ({connectWeb3}) => {
	  const [account, setAccount] = useRecoilState(accountState);
    const history = useHistory();

    const getAccount = async () => {
      try{
        const web = await getWeb3();
        const accounts = await web.eth.getAccounts();
        const curAccount = accounts[0]
        setAccount(curAccount)
        history.goBack()
      }
      catch(error){
        console.log(error)
      }
    }

    return(
      <div css={back}>
          <div css={walletStyle}>
            <span>MetaMask 계정을 연동해주세요.</span>
            <img src="images/metamask.png" alt="metamask"/>
            <button css={Button} onClick={getAccount}>MetaMask 연동하기</button>
        </div>
      </div>

    )
}

export default Wallet;