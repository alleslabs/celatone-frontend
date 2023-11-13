import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useInternalNavigate } from "lib/app-provider";

export const ToContractButton = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  const isSavedAccounts = router.pathname === "/[network]/saved-accounts";
  return (
    <Text
      textAlign="right"
      mr={3}
      color="accent.main"
      fontWeight={700}
      variant="body3"
      cursor="pointer"
      minW={16}
      onClick={() =>
        navigate(
          isSavedAccounts
            ? { pathname: "/contract-lists/saved-contracts" }
            : {
                pathname: "/contracts/[contractAddress]",
                query: { contractAddress: router.query.accountAddress },
              }
        )
      }
    >
      {isSavedAccounts ? "To Saved Contracts" : "To Contract Details"}
    </Text>
  );
};
