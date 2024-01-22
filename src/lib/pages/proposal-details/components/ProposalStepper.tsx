import { Flex, Text } from "@chakra-ui/react";

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
  return (
    <Flex justifyContent="space-between" w="full" alignItems="flex-start">
      <Flex gap={2}>
        {/* TODO: Color changes when state changes */}
        <Flex
          borderRadius="32px"
          w={6}
          h={6}
          alignItems="center"
          justifyContent="center"
          background="gray.500"
          color="background.main"
          fontWeight={400}
        >
          {step}
        </Flex>
        <Flex direction="column" alignItems="flex-start">
          <Text variant="body1" color="text.main" fontWeight={600}>
            {title}
          </Text>
          <Text variant="body3" color="text.dark">
            {description}
          </Text>
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        gap={2}
        background="gray.900"
        borderRadius="8px"
        px={2}
      >
        <Flex h={3} w={3} background="gray.600" borderRadius="24px" />
        <Text variant="body3" color="text.main">
          Waiting For Deposit
        </Text>
      </Flex>
    </Flex>
  );
};
