/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import {useEffect, useState} from "react";
import Asset from "./Asset";
import { useRecoilState } from 'recoil';
import { keywordState } from '../state/state';

const market= css`
	position: absolute;
	margin-top: 1em;
	left: 50%;
	transform: translate(-50%);
	width: 90%;
	height: 100%;
	background-color: white;
	box-shadow: 6px 0px 6px 2px rgba(217, 217, 217, 1);
	display: flex;
	flex-wrap: wrap;
	justify-content: left;
	align-content: stretch;
`
const filter={
	status: 'unpinned',
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

const Market = ({contract,pinata}) => {
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
				<Asset key={key} asset={assets[key]} contract={contract} pinata={pinata} exchangeRate={exchangeRate}/>
			))}
		</div>
	)
};

export default Market;

