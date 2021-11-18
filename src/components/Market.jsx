/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import {WebDispatch} from "../App";
import {useContext, useEffect, useState} from "react";
import Asset from "./Asset";
import { useRecoilState, useRecoilValue } from 'recoil';
import { accountState, keywordState } from '../state/state';

const market= css`
	width: 66%;
	height: 100%;
	background-color: white;
	box-shadow: 6px 0px 6px 2px rgba(217, 217, 217, 1);
`
const asset = css`
	list-style: none;
	width: 230px;
	height: 350px;
	box-shadow: 6px 0px 6px 2px rgba(217, 217, 217, 1);
	img{
		object-fit: contain;
		width: 100%;
	}
`
const filter={
	status: 'pinned',
	metadata:{
		name: '',
		keyvalues: {
			state: {
				value: 'public',
				op: 'eq'
			}
		}
	}
}

const Market = ({history,contract,pinata}) => {
	const [keyword, setKeyword] = useRecoilState(keywordState) //검색 키워드
	const [assets, setAssets] = useState({}); //마켓에서 보여지는 토큰들
	const [exchangeRate, setExchangeRate] = useState();

	const getRate = async () => {
		const response = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
		const result = await response.json(); 
		const eth = Number(result.rates.eth.value)
		const krw = Number(result.rates.krw.value)
		const rate = krw/eth
		console.log(rate)
		setExchangeRate(rate)
	}

	useEffect(() => {
		getRate()
		filter.metadata.name=keyword;
		async function fetchPinned() {
			const tokens = await pinata.pinList(filter);
			setAssets(tokens.rows);
		}
		fetchPinned();
	},[keyword]);

	return (
		<div css={market}>
			{Object.keys(assets).map(key => (
				<Asset asset={assets[key]} contract={contract} pinata={pinata} exchangeRate={exchangeRate}/>
			))}
		</div>
	)

};

export default Market;

