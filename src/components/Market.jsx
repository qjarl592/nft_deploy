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
	width: 95%;
	background-color: white;
	box-shadow: 0px 0px 6px 6px rgba(217, 217, 217, 1);
	display: flex;
	flex-wrap: wrap;
	justify-content: left;
	align-content: stretch;
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

const Market = ({contract,pinata, exchangeRate, baseURL}) => {
	const [keyword, setKeyword] = useRecoilState(keywordState) //검색 키워드
	const [assets, setAssets] = useState({}); //마켓에서 보여지는 토큰들
	const [mkFlag, setMkFlag] = useState(false);

	useEffect(() => {
		setMkFlag(true)
	},[])
	useEffect(() => {
		filter.metadata.name=keyword;
		async function fetchPinned() {
			const tokens = await pinata.pinList(filter);
			setAssets(tokens.rows);
		}
		fetchPinned();
		setMkFlag(false)
	},[keyword, mkFlag]);

	return (
		<div css={market}>
			{Object.keys(assets).map(key => (
				<Asset key={key} asset={assets[key]} contract={contract} pinata={pinata} exchangeRate={exchangeRate} setMkFlag={setMkFlag} baseURL={baseURL}/>
			))}
		</div>
	)
};

export default Market;

