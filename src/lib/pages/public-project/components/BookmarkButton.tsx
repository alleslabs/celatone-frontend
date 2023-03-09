import { Flex, Button, useToast, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { CSSProperties, MouseEvent } from "react";
import { useCallback } from "react";

import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import { usePublicProjectStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Option, PublicDetail } from "lib/types";

interface BookmarkButtonProps {
  details: Option<PublicDetail>;
  slug: string;
  hasText?: boolean;
}

const buttonTextProps: CSSProperties = {
  padding: "6px 16px",
  minWidth: "auto",
  height: "auto",
  borderRadius: "8px",
};

const buttonIconProps: CSSProperties = {
  padding: "2px",
  minWidth: "fit-content",
  height: "fit-content",
  borderRadius: "full",
};

const toastIcon = <CustomIcon name="check-circle-solid" color="success.main" />;

interface StyledButtonProps {
  hasText: boolean;
  actionText: string;
  icon: IconKeys;
  iconColor: string;
  action: (e: MouseEvent<HTMLButtonElement>) => void;
  variant: string;
}

const StyledButton = ({
  hasText,
  actionText,
  icon,
  action,
  variant,
  iconColor,
}: StyledButtonProps) => (
  <Button
    variant={hasText ? variant : "ghost"}
    style={hasText ? buttonTextProps : buttonIconProps}
    gap={2}
    onClick={action}
  >
    <CustomIcon name={icon} color={iconColor} />
    {hasText && <Text>{actionText}</Text>}
  </Button>
);

export const BookmarkButton = observer(
  ({ details, slug, hasText = true }: BookmarkButtonProps) => {
    const { isPublicProjectSaved, savePublicProject, removePublicProject } =
      usePublicProjectStore();
    const toast = useToast({
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: toastIcon,
    });

    const handleSave = useCallback(() => {
      AmpTrack(AmpEvent.PUBLIC_SAVE);
      savePublicProject({
        name: details?.name || "",
        slug,
        logo: details?.logo || "",
      });
      toast({
        title: `Bookmarked \u2018${details?.name}\u2019 successfully`,
      });
    }, [slug, details, savePublicProject, toast]);

    const handleRemove = useCallback(() => {
      AmpTrack(AmpEvent.PUBLIC_REMOVE);
      removePublicProject(slug);
      toast({
        title: `\u2018${details?.name}\u2019 is removed from bookmark`,
      });
    }, [slug, details, removePublicProject, toast]);

    return (
      <Flex alignItems="center">
        {isPublicProjectSaved(slug) ? (
          <StyledButton
            variant="outline-primary"
            hasText={hasText}
            icon="bookmark-solid"
            iconColor="violet.light"
            actionText="Bookmarked"
            action={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          />
        ) : (
          <StyledButton
            variant="outline"
            hasText={hasText}
            icon="bookmark"
            iconColor="pebble.600"
            actionText="Bookmark Project"
            action={(e) => {
              if (details) {
                e.stopPropagation();
                handleSave();
              }
            }}
          />
        )}
      </Flex>
    );
  }
);
