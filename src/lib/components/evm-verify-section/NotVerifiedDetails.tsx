import { Button, Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import type { HexAddr20 } from "lib/types";

interface NotVerifiedDetailsProps {
  contractAddress: HexAddr20;
}

export const NotVerifiedDetails = ({
  contractAddress,
}: NotVerifiedDetailsProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  const handleNavigate = () =>
    navigate({
      pathname: "/evm-contracts/verify",
      query: { contractAddress },
    });

  return (
    <Flex
      pl={6}
      justifyContent="space-between"
      alignItems={isMobile ? "flex-start" : "center"}
      flexDirection={isMobile ? "column" : "row"}
      w="full"
      borderColor="primary.main"
      borderLeftWidth={4}
      gap={2}
    >
      {isMobile ? (
        <>
          <Text variant="body2" color="text.dark">
            This contract has not been verified. If you are the owner, you can
            verify it to allow other users to view the source code
          </Text>
          <Text variant="body2" color="text.dark">
            Verification is only currently supported on desktop.
          </Text>
        </>
      ) : (
        <>
          <Text variant="body2" color="text.dark">
            This contract has not been verified. If you are the owner, you can{" "}
            <Text
              as="span"
              cursor="pointer"
              color="primary.main"
              transition="all 0.25s ease-in-out"
              _hover={{
                textDecoration: "underline",
                textDecorationColor: "primary.light",
              }}
              onClick={handleNavigate}
            >
              verify it
            </Text>{" "}
            to allow other users to view the source code
          </Text>
          <Button variant="ghost-primary" size="sm" onClick={handleNavigate}>
            Verify contract
          </Button>
        </>
      )}
    </Flex>
  );
};
