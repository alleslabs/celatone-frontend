import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import { ShowMoreButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { EditSavedAccountModal } from "lib/components/modal";
import type { AccountLocalInfo } from "lib/stores/account";

interface UserAccountDescProps {
  accountLocalInfo: AccountLocalInfo;
  publicAccount?: boolean;
}

export const UserAccountDesc = observer(
  ({ accountLocalInfo, publicAccount = false }: UserAccountDescProps) => {
    const [showMore, setShowMore] = useState(false);
    const description = accountLocalInfo?.description;
    const [ref, { clampedText, key, noClamp }] = useClampText({
      ellipsis: "...",
      lines: publicAccount ? 4 : 2,
      text: description || "No Contract description",
    });

    const renderEditAccountButton = () => {
      if (!accountLocalInfo) return null;
      return (
        <EditSavedAccountModal
          triggerElement={
            <Button
              size="xs"
              variant="ghost-primary"
              leftIcon={<CustomIcon name="edit" boxSize={3} />}
            >
              {description ? "Edit" : "Add Description"}
            </Button>
          }
          accountLocalInfo={accountLocalInfo}
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
        bg="gray.900"
        flex={1}
        maxW="100%"
        minH="full"
        p={4}
        borderRadius="8px"
        direction="column"
        role="group"
      >
        <Flex align="center" h="32px" justify="space-between">
          <Text variant="body2" color="text.dark" fontWeight={500}>
            Your Account Description
          </Text>
          <Box display="none" _groupHover={{ display: "flex" }}>
            {renderEditAccountButton()}
          </Box>
        </Flex>
        <Text
          key={key}
          variant="body2"
          whiteSpace="pre-wrap"
          ref={ref as React.MutableRefObject<HTMLParagraphElement>}
        >
          <Linkify>{displayDescription}</Linkify>
        </Text>

        {!noClamp && description && (
          <ShowMoreButton
            setToggleShowMore={() => setShowMore(!showMore)}
            showLessText="View Less Description"
            showMoreText="View Full Description"
            toggleShowMore={showMore}
          />
        )}
      </Flex>
    );
  }
);
