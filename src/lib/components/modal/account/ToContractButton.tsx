import { Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { useRouter } from "next/router";

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
      color="primary.main"
      cursor="pointer"
      fontWeight={700}
      minW={16}
      mr={3}
      textAlign="right"
      variant="body3"
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
      Go to {isAccountPrefilled ? "saved contracts" : "contract details"}
    </Text>
  );
};
