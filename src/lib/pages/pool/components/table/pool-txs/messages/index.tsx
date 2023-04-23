import { Text } from "@chakra-ui/react";

import type { Message } from "lib/types";

export const PoolTxsAction = ({ msg }: { msg: Message }) => {
  // TODO: fix and add cases
  const { type } = msg;
  switch (type) {
    case "type1":
    case "type2":
    case "type3":
    default:
      return <Text>{type}</Text>;
  }
};

export const PoolTxsDetail = ({ msg }: { msg: Message }) => {
  // TODO: fix and add cases
  const { type } = msg;
  switch (type) {
    case "type1":
    case "type2":
    case "type3":
    default:
      return <Text h={20}>{type}</Text>;
  }
};
