import axios, { AxiosError, AxiosInstance } from 'axios';
import config from "../utils/config";
import type { JsonRpcErrorResponse, JsonRpcRequest } from "../types/RPCType";
import type { NetworkInfoResponse } from "../types/RPCType";

const rpcAxios: AxiosInstance = axios.create({
  baseURL: config.nodeUrl,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export async function getNetworkInfo(): Promise<void | NetworkInfoResponse> {
  try {
    const requestData: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 'dontcare',
      method: 'network_info',
      params: []
    };

    const response = await rpcAxios.post('/', requestData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<JsonRpcErrorResponse>;
    if (axiosError.response) {
      const errorType = axiosError.response.data.error.name;
      const errorCause = axiosError.response.data.error.cause.name;
      console.error(`Error type: ${errorType}\nError cause: ${errorCause}`);
    } else {
      console.error(`Error: ${axiosError.message}`);
    }
  }
}