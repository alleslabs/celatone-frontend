import { Flex, Button, Image, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { useInternalNavigate } from "lib/app-provider";
import { SaveNewContractModal } from "lib/components/modal/contract";
import { ADMIN_SPECIAL_SLUG, INSTANTIATED_LIST_NAME } from "lib/data";
import type { LVPair } from "lib/types";
import { formatSlugName } from "lib/utils";

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
    <Button
      leftIcon={<CustomIcon name="add-new" boxSize="4" color="text.main" />}
      onClick={handleAction}
    >
      Deploy New Contract
    </Button>
  ) : (
    <Flex alignItems="center" gap="4" color="text.dark" direction="column">
      <Flex align="center">
        Save existing contracts to the list with
        <SaveNewContractModal
          key={list.value}
          list={list}
          buttonProps={{
            variant: "outline-primary",
            leftIcon: <CustomIcon name="bookmark" color="violet.light" />,
            children: "Save Contract",
            ml: 2,
          }}
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

export const ZeroState = ({ list, isReadOnly }: ZeroStateProps) => {
  const navigate = useInternalNavigate();
  return (
    <Flex
      borderY="1px solid"
      borderColor="pebble.700"
      width="full"
      py="48px"
      direction="column"
      alignContent="center"
    >
      <Flex alignItems="center" flexDir="column" gap="4">
        <Image
          src="https://assets.alleslabs.dev/illustration/search-empty.svg"
          alt="result not found"
          width="200px"
        />
        <Text color="text.dark">{renderText(list.value)}</Text>
        {!isReadOnly && (
          <ActionSection
            list={list}
            handleAction={() => navigate({ pathname: "/deploy" })}
          />
        )}
      </Flex>
    </Flex>
  );
};
