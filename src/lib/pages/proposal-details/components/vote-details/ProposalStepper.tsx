import { Flex, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";

interface ProposalStepperProps {
  title: string;
  description: string;
  step: number;
}

export const ProposalStepper = ({
  title,
  description,
  step,
}: ProposalStepperProps) => {
  const isMobile = useMobile();
  return (
    <Flex
      justifyContent="space-between"
      w="full"
      alignItems="flex-start"
      direction={{ base: "column", md: "row" }}
    >
      <Flex
        alignItems={{ base: "center", md: "flex-start" }}
        justifyContent="space-between"
        w="full"
      >
        <Flex gap={2}>
          {/* TODO: Color changes when state changes */}
          <Flex
            borderRadius="32px"
            w={{ base: 5, md: 6 }}
            minW={{ base: 5, md: 6 }}
            h={{ base: 5, md: 6 }}
            minH={{ base: 5, md: 6 }}
            alignItems="center"
            justifyContent="center"
            background="gray.500"
            color="background.main"
            fontWeight={400}
          >
            {step}
          </Flex>
          <Flex
            direction="column"
            alignItems={{ base: "center", md: "flex-start" }}
          >
            <Text variant="body1" color="text.main" fontWeight={600}>
              {title}
            </Text>
            {!isMobile && (
              <Text variant="body3" color="text.dark" textAlign="left">
                {description}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex
          alignItems="center"
          gap={2}
          background="gray.900"
          borderRadius="8px"
          px={2}
        >
          <Flex
            h={3}
            minH={3}
            w={3}
            minW={3}
            background="gray.600"
            borderRadius="24px"
          />
          <Text variant="body3" color="text.main">
            Waiting For Deposit
          </Text>
        </Flex>
      </Flex>
      {isMobile && (
        <Text variant="body3" color="text.dark" textAlign="left" mt={1}>
          {description}
        </Text>
      )}
    </Flex>
  );
};
