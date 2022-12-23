import { Heading, Box, Flex, Text } from "@chakra-ui/react";

import { ContractListTable } from "lib/pages/contracts/components/ContractListTable";
import type { ContractAddr } from "lib/types";

/* TODO: change data -> recently view contracts */
const contracts = [
  {
    address: "terra18kw0z0nmpk9drz4qxq8y7xvh05tr7spyzja3rq" as ContractAddr,
    name: "Deposit asset",
    tags: ["deposit", "lending"],
    instantiator: "terra18kw0z0nmpk9drz4qxq8y7xvh05tr7spyzja3rq",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sed facilisis facilisis risus. Ut volutpat accumsan massa eget consequat, id egestas nulla.",
    label: "label1",
    created: new Date(),
  },
  {
    address: "terra18kw0z0nmpk9drz4qxq8y7xvh05tr7spyzja3rq" as ContractAddr,
    name: "Borrow asset",
    tags: ["deposit", "lending", "borrow", "beeb", "margin"],
    instantiator: "terra18kw0z0nmpk9drz4qxq8y7xvh05tr7spyzja3rq",
    description: "Lorem ipsum dolor id egestas nulla.",
    label: "label2",
    created: new Date(),
  },
  {
    address: "terra18kw0z0nmpk9drz4qxq8y7xvh05tr7spyzja3rq" as ContractAddr,
    name: "",
    tags: ["deposit", "lending", "borrow", "margin"],
    instantiator: "terra18kw0z0nmpk9drz4qxq8y7xvh05tr7spyzja3rq",
    description: "",
    label: "label3",
    created: new Date(),
  },
  {
    address: "terra18kw0z0nmpk9drz4qxq8y7xvh05tr7spyzja3rq" as ContractAddr,
    name: "Deposit asset to Lorem",
    tags: [],
    instantiator: "terra18kw0z0nmpk9drz4qxq8y7xvh05tr7spyzja3rq",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. id egestas nulla.",
    label: "label4",
    created: new Date(),
  },
];
export const RecentlyViewContracts = () => {
  return (
    <Box py={8}>
      <Heading px={12} as="h6" variant="h6" mb={4}>
        Recently Viewed Contracts
      </Heading>
      {contracts && contracts.length ? (
        <ContractListTable contracts={contracts} />
      ) : (
        <Flex
          px={12}
          borderTopWidth={1}
          borderBottomWidth={1}
          justifyContent="center"
          alignItems="center"
          minH="128px"
          gap={1}
        >
          <Text color="text.dark" variant="body1">
            Your recently viewed smart contracts will display here
          </Text>
        </Flex>
      )}
    </Box>
  );
};
