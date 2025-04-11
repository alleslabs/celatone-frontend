import type Big from "big.js";
import type { Option, ValidatorData } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ValidatorImage } from "lib/components/ValidatorImage";
import { truncate } from "lib/utils";

import { ValidatorStats } from "./ValidatorStats";
import { ValidatorTitle } from "./ValidatorTitle";
import { WebsiteButton } from "./WebsiteButton";

interface ValidatorTopProps {
  info: ValidatorData;
  totalVotingPower: Big;
  singleStakingDenom: Option<string>;
}

export const ValidatorTop = ({
  info,
  totalVotingPower,
  singleStakingDenom,
}: ValidatorTopProps) => (
  <>
    <Breadcrumb
      items={[
        {
          text: "Validators",
          href: "/validators",
        },
        { text: info.moniker || truncate(info.validatorAddress) },
      ]}
    />
    <Flex alignItems={{ base: "start", md: "center" }} gap={4}>
      <Flex display={{ base: "none", md: "flex" }}>
        <ValidatorImage boxSize={32} validator={info} />
      </Flex>
      <Flex direction="column" gap={{ base: 2, md: 1 }} w="full">
        <ValidatorTitle info={info} />
        <ValidatorStats
          commissionRate={info.commissionRate}
          singleStakingDenom={singleStakingDenom}
          totalVotingPower={totalVotingPower}
          validatorAddress={info.validatorAddress}
        />
        <Flex
          alignItems={{ md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={{ base: 0, md: 2 }}
          mt={{ base: 1, md: 0 }}
        >
          <Text
            color="text.dark"
            fontWeight={500}
            minW={32}
            variant="body2"
            whiteSpace="nowrap"
          >
            Validator address:
          </Text>
          <CopyLink type="validator_address" value={info.validatorAddress} />
        </Flex>
        <Flex
          alignItems={{ md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={{ base: 0, md: 2 }}
          mt={{ base: 1, md: 0 }}
        >
          <Text
            color="text.dark"
            fontWeight={500}
            minW={32}
            variant="body2"
            whiteSpace="nowrap"
          >
            Account address:
          </Text>
          <ExplorerLink
            fixedHeight={false}
            maxWidth="full"
            textFormat="normal"
            type="user_address"
            value={info.accountAddress}
          />
        </Flex>
        <WebsiteButton
          display={{ base: "flex", md: "none" }}
          href={info.website}
          my={2}
        />
      </Flex>
    </Flex>
  </>
);
