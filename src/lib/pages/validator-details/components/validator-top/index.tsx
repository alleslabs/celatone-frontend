import { Flex, Text } from "@chakra-ui/react";

import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";

import { ValidatorImage } from "./ValidatorImage";
import { ValidatorStats } from "./ValidatorStats";
import { ValidatorTitle } from "./ValidatorTitle";
import { WebsiteButton } from "./WebsiteButton";

export const ValidatorTop = () => (
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
        { text: `validator name` },
      ]}
    />
    <Flex gap={4} alignItems={{ base: "start", md: "center" }}>
      <ValidatorImage boxSize={32} display={{ base: "none", md: "flex" }} />
      <Flex direction="column" w="full" gap={{ base: 2, md: 1 }}>
        <ValidatorTitle />
        <ValidatorStats />
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
          <CopyLink
            value="osmovaloper14lzvt4gdwh2q4ymyjqma0p4j4aykpn92l4warr"
            type="validator_address"
          />
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
            value="cltn14lzvt4gdwh2q4ymyjqma0p4j4aykpn92l4warr"
            textFormat="normal"
            maxWidth="full"
            fixedHeight={false}
          />
        </Flex>
        <WebsiteButton my={2} display={{ base: "flex", md: "none" }} />
      </Flex>
    </Flex>
  </Flex>
);
