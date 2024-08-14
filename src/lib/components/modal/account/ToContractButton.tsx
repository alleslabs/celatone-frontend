import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";

interface ToContractButtonProps {
  isAccountPrefilled: boolean;
}

export const ToContractButton = ({
  isAccountPrefilled,
}: ToContractButtonProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  return (
    <Text
      textAlign="right"
      mr={3}
      color="primary.main"
      fontWeight={700}
      variant="body3"
      cursor="pointer"
      minW={16}
      onClick={() => {
        track(AmpEvent.ACCOUNT_TO_CONTRACT_BUTTON);
        navigate(
          isAccountPrefilled
            ? { pathname: "/contract-lists/saved-contracts" }
            : {
                pathname: "/contracts/[contractAddress]",
                query: { contractAddress: router.query.accountAddress },
              }
        );
      }}
    >
      Go to {isAccountPrefilled ? "Saved Contracts" : "Contract Details"}
    </Text>
  );
};
