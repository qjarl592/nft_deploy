import {atom, selector} from "recoil";
import getWeb3 from "../service/getWeb3";

export const accountState = atom({
    key: 'accountState',
    default : "initial"
})

export const contractState = atom({
    key: 'contractState',
    default : null,
})

export const webState = atom({
    key: 'webState',
    default: null
});

export const getWebSelector = selector({
    key: 'get/web',
    get: async ({get}) =>{
        const response = await getWeb3();
        console.log(response);
        return response;
    },
    set: ({set}, newValue) =>{
        set(webState, newValue);
    }
})

export const keywordState = atom({
    key: 'keywordState',
    default: null
})