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
      minW={16}
      mr={3}
      textAlign="right"
      variant="body3"
      color="primary.main"
      cursor="pointer"
      fontWeight={700}
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
