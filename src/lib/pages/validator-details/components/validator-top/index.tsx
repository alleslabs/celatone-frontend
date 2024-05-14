import { Flex, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ValidatorImage } from "lib/components/ValidatorImage";
import type { Option, ValidatorData } from "lib/types";

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
        { text: info.moniker },
      ]}
    />
    <Flex gap={4} alignItems={{ base: "start", md: "center" }}>
      <Flex display={{ base: "none", md: "flex" }}>
        <ValidatorImage validator={info} boxSize={32} />
      </Flex>
      <Flex direction="column" w="full" gap={{ base: 2, md: 1 }}>
        <ValidatorTitle info={info} />
        {/* // TODO: Support LCD data */}
        <ValidatorStats
          validatorAddress={info.validatorAddress}
          commissionRate={info.commissionRate}
          totalVotingPower={totalVotingPower}
          singleStakingDenom={singleStakingDenom}
        />
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
        <WebsiteButton
          href={info.website}
          my={2}
          display={{ base: "flex", md: "none" }}
        />
      </Flex>
    </Flex>
  </>
);
