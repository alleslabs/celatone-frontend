import { Flex, Text } from "@chakra-ui/react";
import type Big from "big.js";
import Link from "next/link";

import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ValidatorData } from "lib/types";

import { ValidatorImage } from "./ValidatorImage";
import { ValidatorStats } from "./ValidatorStats";
import { ValidatorTitle } from "./ValidatorTitle";
import { WebsiteButton } from "./WebsiteButton";

interface ValidatorTopProps {
  info: ValidatorData;
  totalVotingPower: Big;
}

export const ValidatorTop = ({ info, totalVotingPower }: ValidatorTopProps) => (
  <Flex
    direction="column"
    gap={5}
    px={{ base: "16px", md: "48px" }}
    pt={{ base: "16px", md: "48px" }}
    bgGradient="linear(to-b, success.background, transparent)"
  >
    <Breadcrumb
      items={[
        {
          text: "Validators",
          href: "/validators",
        },
        { text: info.moniker },
      ]}
    />
    <Flex gap={4} alignItems={{ base: "start", md: "center" }}>
      <ValidatorImage boxSize={32} display={{ base: "none", md: "flex" }} />
      <Flex direction="column" w="full" gap={{ base: 2, md: 1 }}>
        <ValidatorTitle info={info} />
        <ValidatorStats info={info} totalVotingPower={totalVotingPower} />
        <Flex
          mt={{ base: 1, md: 0 }}
          gap={{ base: 0, md: 2 }}
          direction={{ base: "column", md: "row" }}
          alignItems={{ md: "center" }}
        >
          <Text
            color="text.dark"
            minW={32}
            variant="body2"
            fontWeight={500}
            whiteSpace="nowrap"
          >
            Validator Address:
          </Text>
          <CopyLink value={info.validatorAddress} type="validator_address" />
        </Flex>
        <Flex
          mt={{ base: 1, md: 0 }}
          gap={{ base: 0, md: 2 }}
          direction={{ base: "column", md: "row" }}
          alignItems={{ md: "center" }}
        >
          <Text
            color="text.dark"
            minW={32}
            variant="body2"
            fontWeight={500}
            whiteSpace="nowrap"
          >
            Account Address:
          </Text>
          <ExplorerLink
            type="user_address"
            value={info.accountAddress}
            textFormat="normal"
            maxWidth="full"
            fixedHeight={false}
          />
        </Flex>
        <Link href={info.website} target="__blank">
          <WebsiteButton my={2} display={{ base: "flex", md: "none" }} />
        </Link>
      </Flex>
    </Flex>
  </Flex>
);
