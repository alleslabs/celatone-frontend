import { Button, Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { useInternalNavigate } from "lib/app-provider";
import { SaveNewContractModal } from "lib/components/modal/contract";
import { ADMIN_SPECIAL_SLUG, INSTANTIATED_LIST_NAME } from "lib/data";
import type { LVPair } from "lib/types";
import { formatSlugName } from "lib/utils";

import { StateImage } from "./StateImage";

interface ActionSectionProps {
  handleAction?: () => void;
  list: LVPair;
}

interface ZeroStateProps {
  isReadOnly?: boolean;
  list: LVPair;
}

const ActionSection = ({ handleAction, list }: ActionSectionProps) =>
  list.value === formatSlugName(INSTANTIATED_LIST_NAME) ? (
    <Button
      leftIcon={<CustomIcon name="add-new" boxSize={4} />}
      onClick={handleAction}
    >
      Deploy New Contract
    </Button>
  ) : (
    <Flex alignItems="center" gap={4} color="text.dark" direction="column">
      <Flex align="center">
        Save existing contracts to the list with
        <SaveNewContractModal
          key={list.value}
          list={list}
          buttonProps={{
            children: "Save Contract",
            leftIcon: <CustomIcon name="bookmark" />,
            ml: 2,
            variant: "outline-primary",
          }}
        />
      </Flex>
      Contract lists and saved contracts are stored locally on your device.
    </Flex>
  );

const renderText = (listSlug: string) => {
  switch (listSlug) {
    case ADMIN_SPECIAL_SLUG:
      return "You don’t have any admin access to any contracts.";
    case formatSlugName(INSTANTIATED_LIST_NAME):
      return "Your deployed contract through this address will display here.";
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
      width="full"
      alignItems="center"
      gap={4}
      py={12}
      borderColor="gray.700"
      borderY="1px solid"
      direction="column"
    >
      <StateImage imageVariant="empty" />
      <Text color="text.dark">{renderText(list.value)}</Text>
      {!isReadOnly && (
        <ActionSection
          list={list}
          handleAction={() => navigate({ pathname: "/deploy" })}
        />
      )}
    </Flex>
  );
};

export const AccountZeroState = ({ button }: { button: JSX.Element }) => (
  <Flex
    width="full"
    alignItems="center"
    gap={4}
    my={8}
    py={12}
    borderColor="gray.700"
    borderY="1px solid"
    color="text.dark"
    direction="column"
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
    width="full"
    alignItems="center"
    gap={4}
    my={8}
    py={12}
    borderColor="gray.700"
    borderY="1px solid"
    color="text.dark"
    direction="column"
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
