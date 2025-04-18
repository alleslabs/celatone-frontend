import type { HexAddr20 } from "lib/types";

import { Button, Text } from "@chakra-ui/react";
import { useInternalNavigate, useMobile } from "lib/app-provider";

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
        <Text color="text.dark" variant="body2">
          This contract has not been verified. If you are the owner, you can
          verify it to allow other users to view the source code
        </Text>
        <Text color="text.dark" variant="body2">
          Verification is only currently supported on desktop.
        </Text>
      </>
    );

  return (
    <>
      <Text color="text.dark" variant="body2">
        This contract has not been verified. If you are the owner, you can{" "}
        <Text
          _hover={{
            textDecoration: "underline",
            textDecorationColor: "primary.light",
          }}
          as="span"
          color="primary.main"
          cursor="pointer"
          transition="all 0.25s ease-in-out"
          onClick={handleNavigate}
        >
          verify it
        </Text>{" "}
        to allow other users to view the source code
      </Text>
      <Button size="sm" variant="ghost-primary" onClick={handleNavigate}>
        Verify contract
      </Button>
    </>
  );
};
