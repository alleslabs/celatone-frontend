import { Flex, Button, Icon, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { MdOutlineAdd, MdBookmarkBorder, MdSearch } from "react-icons/md";

import { SaveNewContract } from "lib/components/modal/contract";
import { ADMIN_SPECIAL_SLUG, INSTANTIATED_LIST_NAME } from "lib/data";
import type { LVPair } from "lib/types";
import { formatSlugName } from "lib/utils";

import { DisconnectedState } from "./DisconnectedState";

interface ZeroStateProps {
  list: LVPair;
  isReadOnly?: boolean;
}

interface ActionSectionProps {
  list: LVPair;
  handleAction?: () => void;
}

const ActionSection = ({ list, handleAction }: ActionSectionProps) =>
  list.value === formatSlugName(INSTANTIATED_LIST_NAME) ? (
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

/**
 *
 * @todo Will be refactored in the next PR
 */

export const ZeroState = ({ list, isReadOnly }: ZeroStateProps) => {
  const router = useRouter();
  const { isWalletConnected } = useWallet();

  const isInstantiatedByMe =
    list.value === formatSlugName(INSTANTIATED_LIST_NAME);

  const renderText = () => {
    switch (list.value) {
      case formatSlugName(INSTANTIATED_LIST_NAME):
        return "Your deployed contract through this address will display here.";
      case ADMIN_SPECIAL_SLUG:
        return "You don’t have any admin access to any contracts.";
      default:
        return "You don’t have any saved contracts.";
    }
  };

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
        <DisconnectedState text="to deploy new contracts." />
      ) : (
        <Flex alignItems="center" flexDir="column" gap="4">
          <Icon as={MdSearch} color="gray.600" boxSize="16" />
          <Text color="text.dark">{renderText()}</Text>
          {!isReadOnly && (
            <ActionSection
              list={list}
              handleAction={() => router.push("/deploy")}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
};
