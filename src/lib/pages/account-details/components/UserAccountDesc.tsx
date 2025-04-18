import type { AccountLocalInfo } from "lib/stores/account";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ShowMoreButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { EditSavedAccountModal } from "lib/components/modal";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

interface UserAccountDescProps {
  publicAccount?: boolean;
  accountLocalInfo: AccountLocalInfo;
}

export const UserAccountDesc = observer(
  ({ accountLocalInfo, publicAccount = false }: UserAccountDescProps) => {
    const [showMore, setShowMore] = useState(false);
    const description = accountLocalInfo?.description;
    const [ref, { clampedText, key, noClamp }] = useClampText({
      ellipsis: "...",
      lines: publicAccount ? 4 : 2,
      text: description || "No contract description",
    });

    const renderEditAccountButton = () => {
      if (!accountLocalInfo) return null;
      return (
        <EditSavedAccountModal
          accountLocalInfo={accountLocalInfo}
          triggerElement={
            <Button
              leftIcon={<CustomIcon boxSize={3} name="edit" />}
              size="xs"
              variant="ghost-primary"
            >
              {description ? "Edit" : "Add description"}
            </Button>
          }
        />
      );
    };

    const displayDescription = useMemo(() => {
      if (!description) {
        return "No account description";
      }
      return showMore ? description : clampedText;
    }, [clampedText, description, showMore]);

    return (
      <Flex
        bg="gray.900"
        borderRadius="8px"
        direction="column"
        flex={1}
        maxW="100%"
        minH="full"
        p={4}
        role="group"
      >
        <Flex align="center" h="32px" justify="space-between">
          <Text color="text.dark" fontWeight={500} variant="body2">
            Your account description
          </Text>
          <Box _groupHover={{ display: "flex" }} display="none">
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
            showLessText="View less description"
            showMoreText="View full description"
            toggleShowMore={showMore}
          />
        )}
      </Flex>
    );
  }
);
