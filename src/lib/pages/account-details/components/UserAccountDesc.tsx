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
  publicAccount?: boolean;
  accountLocalInfo: AccountLocalInfo;
}

export const UserAccountDesc = observer(
  ({ accountLocalInfo, publicAccount = false }: UserAccountDescProps) => {
    const [showMore, setShowMore] = useState(false);
    const description = accountLocalInfo?.description;
    const [ref, { noClamp, clampedText, key }] = useClampText({
      text: description || "No contract description",
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
              variant="ghost-primary"
              leftIcon={<CustomIcon name="edit" boxSize={3} />}
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
        direction="column"
        bg="gray.900"
        maxW="100%"
        borderRadius="8px"
        p={4}
        minH="full"
        flex={1}
        role="group"
      >
        <Flex justify="space-between" align="center" h="32px">
          <Text variant="body2" fontWeight={500} color="text.dark">
            Your account description
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
            showMoreText="View full description"
            showLessText="View less description"
            toggleShowMore={showMore}
            setToggleShowMore={() => setShowMore(!showMore)}
          />
        )}
      </Flex>
    );
  }
);
