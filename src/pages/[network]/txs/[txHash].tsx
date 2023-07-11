import { QueryClient, dehydrate } from "@tanstack/react-query";
import type { GetServerSidePropsContext } from "next";

import TxDetails from "lib/pages/tx-details";
import { getAssetInfos } from "lib/services/asset";
import { useTxDataQueryFn } from "lib/services/txService";
import { getFirstQueryParam } from "lib/utils";
import { getChainConfig } from "lib/utils/server/global";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const { network, txHash } = context.query;
  const networkParam = getFirstQueryParam(network);
  const { api, chain } = getChainConfig(networkParam);
  const txsApiRoute = `${api}/txs/${chain}/${networkParam}`;
  const assetsApiRoute = `${api}/assets/${chain}/${networkParam}`;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["tx_data", txsApiRoute, txHash, network] as string[],
      queryFn: useTxDataQueryFn,
    }),
    queryClient.prefetchQuery({
      queryKey: ["query", "assetInfos", assetsApiRoute],
      queryFn: async () => getAssetInfos(assetsApiRoute),
    }),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default TxDetails;
