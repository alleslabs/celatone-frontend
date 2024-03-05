import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";

import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { DotSeparator } from "lib/components/DotSeparator";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";

import { ValidatorStatusTag } from "./ValidatorStatusTag";

const ValidatorTitle = () => (
  <Flex gap={4} alignItems={{ base: "center", md: "auto" }}>
    <Image
      h={16}
      w={16}
      borderRadius="50%"
      objectFit="cover"
      src="https://wildlifecoexistence.org/wp-content/uploads/2020/12/Koala-portrait-scaled.jpg"
      display={{ base: "flex", md: "none" }}
    />
    <Flex
      w="full"
      direction={{ base: "column", md: "row" }}
      justifyContent={{ md: "space-between" }}
      alignItems={{ base: "start", md: "center" }}
    >
      <Flex align="center" gap={2}>
        <Heading
          as="h5"
          mt={{ base: 1, md: 0 }}
          ml={{ base: 1, md: 0 }}
          variant={{ base: "h6", md: "h5" }}
          color="accent.main"
        >
          #111
        </Heading>
        <Heading
          as="h5"
          variant="h5"
          wordBreak="break-word"
          color="text.main"
          display={{ base: "none", md: "flex" }}
        >
          <span>Validator name</span>
        </Heading>
        <ValidatorStatusTag status="Active" />
      </Flex>
      <Heading
        as="h5"
        variant="h6"
        mt={1}
        wordBreak="break-word"
        color="text.main"
        display={{ base: "flex", md: "none" }}
      >
        <span>Validator name</span>
      </Heading>
      <Button
        leftIcon={<CustomIcon name="website" boxSize={3} />}
        rightIcon={<CustomIcon name="launch" boxSize={3} />}
        size="sm"
        variant="outline-primary"
        display={{ base: "none", md: "flex" }}
      >
        Website
      </Button>
    </Flex>
  </Flex>
);

const StatWithLabel = ({ label, value }: { label: string; value: string }) => (
  <Flex gap={{ md: 1 }} direction={{ base: "column", md: "row" }}>
    <Text variant="body2" fontWeight={600} color="text.dark">
      {label}
    </Text>
    <Text variant="body2" fontWeight={600} color="text.main">
      {value}
    </Text>
  </Flex>
);

const ValidatorStats = () => (
  <Flex
    alignItems="center"
    justifyContent={{ base: "space-between", md: "start" }}
    gap={{ base: 3, md: 2 }}
    mt={{ base: 2, md: 1 }}
    mb={{ base: 0, md: 1 }}
    px={{ base: 3, md: 0 }}
    py={{ base: 1, md: 0 }}
    border={{ base: "1px solid", md: "0px" }}
    borderColor="gray.700"
    borderRadius={4}
  >
    <StatWithLabel label="Commission" value="5.00%" />
    <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
    <StatWithLabel label="Estimated APR" value="6.21%" />{" "}
    <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
    <StatWithLabel label="Delegators" value="253" />
  </Flex>
);

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
      <Image
        h={32}
        w={32}
        borderRadius="50%"
        objectFit="cover"
        src="https://wildlifecoexistence.org/wp-content/uploads/2020/12/Koala-portrait-scaled.jpg"
        display={{ base: "none", md: "flex" }}
      />
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
          >
            cltn14lzvt4gdwh2q4ymyjqma0p4j4aykpn92l4warr
          </ExplorerLink>
        </Flex>
        <Button
          leftIcon={<CustomIcon name="website" boxSize={3} />}
          rightIcon={<CustomIcon name="launch" boxSize={3} />}
          size="sm"
          my={2}
          variant="outline-primary"
          display={{ base: "flex", md: "none" }}
        >
          Website
        </Button>
      </Flex>
    </Flex>
  </Flex>
);
