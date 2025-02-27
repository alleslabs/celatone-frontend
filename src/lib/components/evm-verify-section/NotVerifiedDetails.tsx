import { Button, Text } from "@chakra-ui/react";

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

  if (isMobile)
    return (
      <>
        <Text variant="body2" color="text.dark">
          This contract has not been verified. If you are the owner, you can
          verify it to allow other users to view the source code
        </Text>
        <Text variant="body2" color="text.dark">
          Verification is only currently supported on desktop.
        </Text>
      </>
    );

  return (
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
  );
};
