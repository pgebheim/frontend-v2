import axios from "axios";
import { ChainId } from "utils";
import { BridgeLimitInterface } from "../types";

export async function retrieveLimits(
  token: string,
  fromChainId: string | ChainId,
  toChainId: string | ChainId
): Promise<BridgeLimitInterface> {
  // Call to scraper API and resolve the JWT
  const { data } = await axios.get<BridgeLimitInterface>(
    `/api/limits?token=${token}&originChainId=${fromChainId}&destinationChainId=${toChainId}`
  );
  return data;
}
