import type { LVPair } from "lib/types";

import { Button, Flex, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { SaveNewContractModal } from "lib/components/modal/contract";
import { ADMIN_SPECIAL_SLUG, INSTANTIATED_LIST_NAME } from "lib/data";
import { formatSlugName } from "lib/utils";

import { CustomIcon } from "../icon";
import { StateImage } from "./StateImage";

interface ZeroStateProps {
  list: LVPair;
  isReadOnly?: boolean;
}

interface ActionSectionProps {
  list: LVPair;
  handleAction?: () => void;
}

const ActionSection = ({ handleAction, list }: ActionSectionProps) =>
  list.value === formatSlugName(INSTANTIATED_LIST_NAME) ? (
    <Button
      leftIcon={<CustomIcon boxSize={4} name="add-new" />}
      onClick={handleAction}
    >
      Deploy new contract
    </Button>
  ) : (
    <Flex alignItems="center" color="text.dark" direction="column" gap={4}>
      <Flex align="center">
        Save existing contracts to the list with
        <SaveNewContractModal
          key={list.value}
          buttonProps={{
            children: "Save contract",
            leftIcon: <CustomIcon name="bookmark" />,
            ml: 2,
            variant: "outline-primary",
          }}
          list={list}
        />
      </Flex>
      Contract lists and saved contracts are stored locally on your device.
    </Flex>
  );

const renderText = (listSlug: string) => {
  switch (listSlug) {
    case formatSlugName(INSTANTIATED_LIST_NAME):
      return "Your deployed contract through this address will display here.";
    case ADMIN_SPECIAL_SLUG:
      return "You don’t have any admin access to any contracts.";
    default:
      return "You don’t have any saved contracts.";
  }
};

/**
 *
 * @todo Will be refactored in the next PR
 */

export const ZeroState = ({ isReadOnly, list }: ZeroStateProps) => {
  const navigate = useInternalNavigate();
  return (
    <Flex
      alignItems="center"
      borderBottomWidth="1px"
      borderColor="gray.700"
      borderTopWidth="1px"
      direction="column"
      gap={4}
      py={12}
      width="full"
    >
      <StateImage imageVariant="empty" />
      <Text color="text.dark">{renderText(list.value)}</Text>
      {!isReadOnly && (
        <ActionSection
          handleAction={() => navigate({ pathname: "/deploy" })}
          list={list}
        />
      )}
    </Flex>
  );
};

export const AccountZeroState = ({ button }: { button: JSX.Element }) => (
  <Flex
    alignItems="center"
    borderBottomWidth="1px"
    borderColor="gray.700"
    borderTopWidth="1px"
    color="text.dark"
    direction="column"
    gap={4}
    my={8}
    py={12}
    width="full"
  >
    <StateImage imageVariant="empty" />
    <Flex align="center">You don’t have any saved accounts.</Flex>
    <Flex align="center" gap={4}>
      Save existing accounts to the list with
      {button}
    </Flex>
    <Flex align="center">
      Saved accounts are stored locally on your device.
    </Flex>
  </Flex>
);

export const SavedCodeZeroState = ({ button }: { button: JSX.Element }) => (
  <Flex
    alignItems="center"
    borderBottomWidth="1px"
    borderColor="gray.700"
    borderTopWidth="1px"
    color="text.dark"
    direction="column"
    gap={4}
    my={8}
    py={12}
    width="full"
  >
    <StateImage imageVariant="empty" />
    <Flex align="center">You don’t have any saved codes.</Flex>
    <Flex align="center" gap={4}>
      Save existing codes to the list with
      {button}
    </Flex>
    <Flex align="center">Saved codes are stored locally on your device.</Flex>
  </Flex>
);
