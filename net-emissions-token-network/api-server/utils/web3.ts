import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import NetEmissionsTokenNetwork from '../../interface/packages/contracts/src/abis/NetEmissionsTokenNetwork.json';
import { OPTS_TYPE } from "../server";

export const BURN = '0x0000000000000000000000000000000000000000';


const web3_cache: Record<string, Web3> = {}

export const getWeb3 = (opts: OPTS_TYPE) => {
  let url = opts.network_rpc_url;
  if (opts.use_web_socket) {
    if (opts.network_ws_url) {
      url = opts.network_ws_url
    } else if (url.startsWith('http:')) {
      url = url.replace('http:', 'ws:');
    } else if (url.startsWith('https:')) {
      url = url.replace('https:', 'wss:');
    }
  }
  // only cache when using http connection (because ws may hang better recreate them?)
  const canCache = (url.startsWith('http'))
  if (canCache && web3_cache[url]) {
    return web3_cache[url];
  }
  const web3 = new Web3(url);
  if (canCache) web3_cache[url] = web3;
  return web3;
}

export const getContract = (opts: OPTS_TYPE) => {
  if (opts.contract) return opts.contract;
  const web3 = getWeb3(opts);
  return new web3.eth.Contract(NetEmissionsTokenNetwork.abi as AbiItem[], opts.contract_address);
}

export const getCurrentBlock = (opts: OPTS_TYPE) => {
  const web3 = getWeb3(opts);
  return web3.eth.getBlockNumber();
}
