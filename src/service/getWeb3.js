import Web3 from "web3";

const getWeb3 = () =>
    new Promise(async (resolve, reject) => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.enable();
                resolve(web3);
            } catch (error) {
                reject(error);
            }
        }
        else if (window.web3) {
            resolve(window.web3);
        }
        else {
            const provider = new Web3.providers.HttpProvider(
                "https://ropsten.infura.io/v3/e2559d731c1948ccb2f9df34ac13b9d9"
            );
            resolve(new Web3(provider));
        }
    });

export default getWeb3;
