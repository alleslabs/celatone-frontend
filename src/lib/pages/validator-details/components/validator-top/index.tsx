import { Flex, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ValidatorImage } from "lib/components/ValidatorImage";
import type { Option, ValidatorData } from "lib/types";
import { truncate } from "lib/utils";

import { ValidatorStats } from "./ValidatorStats";
import { ValidatorTitle } from "./ValidatorTitle";
import { WebsiteButton } from "./WebsiteButton";

interface ValidatorTopProps {
  info: ValidatorData;
  singleStakingDenom: Option<string>;
  totalVotingPower: Big;
}

export const ValidatorTop = ({
  info,
  singleStakingDenom,
  totalVotingPower,
}: ValidatorTopProps) => (
  <>
    <Breadcrumb
      items={[
        {
          href: "/validators",
          text: "Validators",
        },
        { text: info.moniker || truncate(info.validatorAddress) },
      ]}
    />
    <Flex alignItems={{ base: "start", md: "center" }} gap={4}>
      <Flex display={{ base: "none", md: "flex" }}>
        <ValidatorImage validator={info} boxSize={32} />
      </Flex>
      <Flex gap={{ base: 2, md: 1 }} w="full" direction="column">
        <ValidatorTitle info={info} />
        <ValidatorStats
          validatorAddress={info.validatorAddress}
          commissionRate={info.commissionRate}
          singleStakingDenom={singleStakingDenom}
          totalVotingPower={totalVotingPower}
        />
        <Flex
          alignItems={{ md: "center" }}
          gap={{ base: 0, md: 2 }}
          mt={{ base: 1, md: 0 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text
            minW={32}
            variant="body2"
            whiteSpace="nowrap"
            color="text.dark"
            fontWeight={500}
          >
            Validator Address:
          </Text>
          <CopyLink type="validator_address" value={info.validatorAddress} />
        </Flex>
        <Flex
          alignItems={{ md: "center" }}
          gap={{ base: 0, md: 2 }}
          mt={{ base: 1, md: 0 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text
            minW={32}
            variant="body2"
            whiteSpace="nowrap"
            color="text.dark"
            fontWeight={500}
          >
            Account Address:
          </Text>
          <ExplorerLink
            maxWidth="full"
            fixedHeight={false}
            type="user_address"
            value={info.accountAddress}
            textFormat="normal"
          />
        </Flex>
        <WebsiteButton
          display={{ base: "flex", md: "none" }}
          my={2}
          href={info.website}
        />
      </Flex>
    </Flex>
  </>
);
