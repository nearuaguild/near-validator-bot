interface ActivePeer {
  id: string;
  addr: string;
  account_id: string | null;
}

interface KnownProducer {
  account_id: string;
  addr: string | null;
  peer_id: string;
}

interface NetworkInfoResult {
  active_peers: ActivePeer[];
  num_active_peers: number;
  peer_max_count: number;
  sent_bytes_per_sec: number;
  received_bytes_per_sec: number;
  known_producers: KnownProducer[];
}

interface NetworkInfoResponse {
  jsonrpc: string;
  result: NetworkInfoResult;
  id: string;
}

interface JsonRpcRequest {
  jsonrpc: string;
  id: string;
  method: string;
  params: any[];
}

interface JsonRpcErrorResponse {
  jsonrpc: string;
  id: string;
  error: {
    name: string;
    cause: {
      name: string;
      info?: any;
    };
    code: number;
    data: string;
    message: string;
  };
}

export { ActivePeer, KnownProducer, NetworkInfoResult, NetworkInfoResponse, JsonRpcErrorResponse, JsonRpcRequest };
