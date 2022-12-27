import { Flex, Button, Icon, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { MdOutlineAdd, MdBookmarkBorder, MdSearch } from "react-icons/md";

import { SaveNewContract } from "lib/components/modal/contract";
import type { Option } from "lib/types";

import { DisconnectedState } from "./DisconnectedState";

interface ZeroStateProps {
  list: Option;
  isReadOnly?: boolean;
  isInstantiatedByMe: boolean;
}

const ActionSection = ({
  isInstantiatedByMe,
  handleAction,
  list,
}: {
  isInstantiatedByMe: boolean;
  handleAction?: () => void;
  list: Option;
}) => {
  return isInstantiatedByMe ? (
    <Button rightIcon={<MdOutlineAdd />} onClick={handleAction}>
      Deploy New Contract
    </Button>
  ) : (
    <Flex alignItems="center" gap="4" color="text.dark" direction="column">
      <Flex align="center">
        Save existing contracts to the list with
        <SaveNewContract
          list={list}
          buttonProps={{
            variant: "outline-primary",
            rightIcon: <MdBookmarkBorder />,
            children: "Save Contract",
            ml: 2,
          }}
        />
      </Flex>
      Created contract list and saved contracts are stored in your device only.
    </Flex>
  );
};

export const ZeroState = ({
  list,
  isReadOnly,
  isInstantiatedByMe,
}: ZeroStateProps) => {
  const router = useRouter();
  const { isWalletConnected } = useWallet();

  if (!isWalletConnected && isInstantiatedByMe) {
    return <DisconnectedState text="to deploy new contracts." />;
  }

  return (
    <Flex alignItems="center" flexDir="column" gap="4">
      <Icon as={MdSearch} color="gray.600" boxSize="16" />
      <Text color="text.dark">
        {isInstantiatedByMe
          ? "Your deployed contract through this address will display here"
          : "You don’t have any saved contracts."}
      </Text>
      {!isReadOnly && (
        <ActionSection
          isInstantiatedByMe={isInstantiatedByMe}
          list={list}
          handleAction={() => router.push("/deploy")}
        />
      )}
    </Flex>
  );
};
