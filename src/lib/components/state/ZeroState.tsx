import { Flex, Button, Icon, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { MdOutlineAdd, MdBookmarkBorder, MdSearch } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import { SaveNewContract } from "lib/components/modal/contract";
import type { LVPair } from "lib/types";

import { DisconnectedState } from "./DisconnectedState";

interface ZeroStateProps {
  list: LVPair;
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
  list: LVPair;
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
      Contract lists and saved contracts are stored locally on your device.
    </Flex>
  );
};

/**
 *
 * @todo Will be refactored in the next PR
 */

export const ZeroState = ({
  list,
  isReadOnly,
  isInstantiatedByMe,
}: ZeroStateProps) => {
  const navigate = useInternalNavigate();
  const { isWalletConnected } = useWallet();

  return (
    <Flex
      borderY="1px solid"
      borderColor="divider.main"
      width="full"
      py="48px"
      direction="column"
      alignContent="center"
    >
      {!isWalletConnected && isInstantiatedByMe ? (
        <DisconnectedState text="to see contracts you've previously instantiated." />
      ) : (
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
              handleAction={() => navigate({ pathname: "/deploy" })}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
};
