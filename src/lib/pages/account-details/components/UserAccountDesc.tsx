import { Button, Flex, Text, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import { ShowMoreButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { EditSavedAccountModal } from "lib/components/modal";
import { useAccountStore } from "lib/providers/store";
import type { Addr } from "lib/types";

interface UserAccountDescProps {
  address: Addr;
  publicAccount?: boolean;
}

export const UserAccountDesc = observer(
  ({ address, publicAccount = false }: UserAccountDescProps) => {
    const [showMore, setShowMore] = useState(false);
    const { getAccountLocalInfo } = useAccountStore();
    const accountLocalInfo = getAccountLocalInfo(address);
    const description = accountLocalInfo?.description;
    const [ref, { noClamp, clampedText, key }] = useClampText({
      text: description || "No Contract description",
      ellipsis: "...",
      lines: publicAccount ? 4 : 2,
    });

    const renderEditAccountButton = () => {
      if (!accountLocalInfo) return null;
      return (
        <EditSavedAccountModal
          accountLocalInfo={accountLocalInfo}
          triggerElement={
            <Button
              size="xs"
              variant="ghost-secondary"
              color="secondary.main"
              leftIcon={<CustomIcon name="edit" boxSize={3} />}
            >
              {description ? "Edit" : "Add Description"}
            </Button>
          }
        />
      );
    };

    const displayDescription = useMemo(() => {
      if (!description) {
        return "No Account Description";
      }
      return showMore ? description : clampedText;
    }, [clampedText, description, showMore]);

    return (
      <Flex
        direction="column"
        bg="gray.900"
        maxW="100%"
        borderRadius="8px"
        p={4}
        minH="full"
        flex="1"
        role="group"
      >
        <Flex justify="space-between" align="center" h="32px">
          <Text variant="body2" fontWeight={500} color="text.dark">
            Your Account Description
          </Text>
          <Box display="none" _groupHover={{ display: "flex" }}>
            {renderEditAccountButton()}
          </Box>
        </Flex>
        <Text
          variant="body2"
          whiteSpace="pre-wrap"
          ref={ref as React.MutableRefObject<HTMLParagraphElement>}
          key={key}
        >
          <Linkify>{displayDescription}</Linkify>
        </Text>

        {!noClamp && description && (
          <ShowMoreButton
            showMoreText="View Full Description"
            showLessText="View Less Description"
            toggleShowMore={showMore}
            setToggleShowMore={() => setShowMore(!showMore)}
          />
        )}
      </Flex>
    );
  }
);
