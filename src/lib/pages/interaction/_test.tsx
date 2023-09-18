/* eslint-disable */
import { Button, Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { AxiosError } from "axios";
import { Msg, MsgExecute, MsgPublish, MsgScript } from "@initia/initia.js";

import {
  CELATONE_QUERY_KEYS,
  useCurrentChain,
  useFabricateFee,
  useLCDEndpoint,
  useSimulateFeeQuery,
} from "lib/app-provider";
import type { RpcQueryError } from "lib/types";
import { EncodeObject } from "@cosmjs/proto-signing";

const toEncodeObject = (msgs: Msg[]): EncodeObject[] => {
  return msgs.map((msg) => ({
    typeUrl: msg.toData()["@type"],
    value: msg.toProto(),
  }));
};

export const InteractionTest = () => {
  // const lcdEndpoint = useBaseApiRoute("rest");
  const lcdEndpoint = useLCDEndpoint();
  const accountAddr = "0x589b1e861579c3f07092859db5f8963e1dac50f1";
  const moduleName = "usernames";
  const functionName = "get_config";
  const msg = JSON.stringify({ type_args: [], args: [] });

  // ----------------- QUERY ----------------- //
  const { refetch } = useQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_QUERY, lcdEndpoint, accountAddr, msg],
    async () => {
      const { data } = await axios.post(
        `${lcdEndpoint}/initia/move/v1/accounts/${accountAddr}/modules/${moduleName}/view_functions/${functionName}`,
        msg
      );
      return data;
    },
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      onSettled() {
        console.log("onSettled");
      },
      onSuccess(data) {
        console.log("onSuccess", data);
        window.alert(JSON.stringify(data, null, 2));
      },
      onError(err: AxiosError<RpcQueryError>) {
        console.log("onError", err);
      },
    }
  );

  // ----------------- EXECUTE ----------------- //
  // TYPEURL need to be registered in registry
  const { address, getSigningCosmWasmClient } = useCurrentChain();
  const fabricateFee = useFabricateFee();

  const execute = async () => {
    const client = await getSigningCosmWasmClient();

    if (!client || !address) {
      window.alert("Please connect wallet");
      return;
    }

    const msgs = [
      // new MsgExecute(
      //   address,
      //   "0xee0019b10a5d5db025ac3dc15f3621cad3684a14",
      //   "StdCoin",
      //   "init"
      // ),
      // new MsgExecute(
      //   address,
      //   "0xee0019b10a5d5db025ac3dc15f3621cad3684a14",
      //   "StdCoin",
      //   "register"
      // ),
      new MsgExecute(
        address,
        "0xee0019b10a5d5db025ac3dc15f3621cad3684a14",
        "StdCoin",
        "mint",
        undefined,
        ["AAAAAAAAAAAAAAAA7gAZsQpdXbAlrD3BXzYhytNoShQ=", "QEIPAAAAAAA="]
      ),
    ];

    const fee = fabricateFee(160347);

    const txInfo = await client.signAndBroadcast(
      address,
      toEncodeObject(msgs),
      fee
    );

    window.alert(JSON.stringify(txInfo, null, 2));
  };

  // ----------------- PUBLISH ----------------- //
  const publish = async () => {
    const client = await getSigningCosmWasmClient();

    if (!client || !address) {
      window.alert("Please connect wallet");
      return;
    }

    const msgs = [
      new MsgPublish(
        address,
        [
          "oRzrCwYAAAALAQAIAggkAywxBF0IBWVaB78BsQEI8AJABrADFArEAxoM3gNSDbAEAgAAAQEBAgEDAAQIAAAFAAABCgUBAAEBDAUBAAEBDQUBAAEDDwcAARIEAQABAAYAAQAABwIBAAAIAAEAAxAEBQABEQcIAQACEwAKAAEHCwwBAAEUDQEBAAEIAAEBAAQGBgYHBggGAQYMAAMGDAUDAwsCAQgBCwMBCAELBAEIAQEKAgEIBQEIAQQGDAgFCAUCAwsCAQkACwMBCQALBAEJAAIGCAALBgEIAQEFAgMGCwQBCQABCwYBCQACBQsGAQkAB1N0ZENvaW4EY29pbgZzaWduZXIGc3RyaW5nCENhcFN0b3JlA1N0ZARpbml0BG1pbnQIcmVnaXN0ZXIEYnVybg5CdXJuQ2FwYWJpbGl0eQZmcmVlemUQRnJlZXplQ2FwYWJpbGl0eQ5NaW50Q2FwYWJpbGl0eQtkdW1teV9maWVsZAZTdHJpbmcEdXRmOAppbml0aWFsaXplBENvaW4KYWRkcmVzc19vZgdkZXBvc2l0AAAAAAAAAAAAAAAA7gAZsQpdXbAlrD3BXzYhytNoShQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQoCCQhTdGQgQ29pbgoCBQRTVERDAAIDCQsCAQgBCwsDAQgBBwsEAQgBAQIBDgEAAAQAAxEKAAcAEQMHAREDMQg4AAwDDAIMAQsACwELAgsDEgAtAAIBAAQBAAkNCwARBSsADAMLAgsDEAA4AQwECwELBDgCAgIABAABAwsAOAMCAAIA",
        ],
        0
      ),
    ];

    const fee = fabricateFee(160347);

    const txInfo = await client.signAndBroadcast(
      address,
      toEncodeObject(msgs),
      fee
    );

    window.alert(JSON.stringify(txInfo, null, 2));
  };

  // ----------------- SIMULATE ----------------- //
  const composedTxMsg = [
    new MsgPublish(
      "init1acqpnvg2t4wmqfdv8hq47d3petfksjs59gckf3",
      [
        "oRzrCwYAAAALAQAIAggkAywxBF0IBWVaB78BsQEI8AJABrADFArEAxoM3gNSDbAEAgAAAQEBAgEDAAQIAAAFAAABCgUBAAEBDAUBAAEBDQUBAAEDDwcAARIEAQABAAYAAQAABwIBAAAIAAEAAxAEBQABEQcIAQACEwAKAAEHCwwBAAEUDQEBAAEIAAEBAAQGBgYHBggGAQYMAAMGDAUDAwsCAQgBCwMBCAELBAEIAQEKAgEIBQEIAQQGDAgFCAUCAwsCAQkACwMBCQALBAEJAAIGCAALBgEIAQEFAgMGCwQBCQABCwYBCQACBQsGAQkAB1N0ZENvaW4EY29pbgZzaWduZXIGc3RyaW5nCENhcFN0b3JlA1N0ZARpbml0BG1pbnQIcmVnaXN0ZXIEYnVybg5CdXJuQ2FwYWJpbGl0eQZmcmVlemUQRnJlZXplQ2FwYWJpbGl0eQ5NaW50Q2FwYWJpbGl0eQtkdW1teV9maWVsZAZTdHJpbmcEdXRmOAppbml0aWFsaXplBENvaW4KYWRkcmVzc19vZgdkZXBvc2l0AAAAAAAAAAAAAAAA7gAZsQpdXbAlrD3BXzYhytNoShQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQoCCQhTdGQgQ29pbgoCBQRTVERDAAIDCQsCAQgBCwsDAQgBBwsEAQgBAQIBDgEAAAQAAxEKAAcAEQMHAREDMQg4AAwDDAIMAQsACwELAgsDEgAtAAIBAAQBAAkNCwARBSsADAMLAgsDEAA4AQwECwELBDgCAgIABAABAwsAOAMCAAIA",
      ],
      0
    ),
  ];

  const { refetch: simulateFee } = useSimulateFeeQuery({
    enabled: false,
    messages: toEncodeObject(composedTxMsg),
    onSuccess: (gasRes) => {
      window.alert(gasRes);
    },
  });

  // ----------------- SCRIPT ----------------- //
  const script = async () => {
    const client = await getSigningCosmWasmClient();

    if (!client || !address) {
      window.alert("Please connect wallet");
      return;
    }

    const msgs = [
      new MsgScript(
        address,
        "oRzrCwYAAAAGAQACAwIGBAgCBQoHBxEMCB0gAAAAAQIBAQAAAAEMAAEGCQAFZGVidWcFcHJpbnQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQIAAAABAw4AOAAC",
        ["0x1::native_uinit::Coin", "0x1::native_uusdc::Coin"]
      ),
    ];

    const fee = fabricateFee(80000);

    const txInfo = await client.signAndBroadcast(
      address,
      toEncodeObject(msgs),
      fee
    );

    window.alert(JSON.stringify(txInfo, null, 2));
  };

  return (
    <Flex flexDir="column">
      <Text fontSize="32px">Testing area</Text>
      <Flex flexDir="row" my={4} gap={4}>
        <Button onClick={() => refetch()} width="100px">
          Query
        </Button>
        <Button onClick={() => execute()} width="100px">
          Execute
        </Button>
        <Button onClick={() => publish()} width="100px">
          Publish
        </Button>
        <Button onClick={() => simulateFee()} width="100px">
          Estimate Fee
        </Button>
        <Button onClick={() => script()} width="100px">
          Script
        </Button>
      </Flex>
    </Flex>
  );
};
