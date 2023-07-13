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
  action: (e: MouseEvent<HTMLButtonElement>) => void;
  variant: string;
}

const StyledButton = ({
  hasText,
  actionText,
  icon,
  action,
  variant,
}: StyledButtonProps) => (
  <Button
    variant={hasText ? variant : "ghost-gray"}
    style={hasText ? buttonTextProps : buttonIconProps}
    gap={2}
    onClick={action}
    padding={{ base: "4px", md: "6px 16px" }}
    size={{ base: "xs", md: "md" }}
  >
    <CustomIcon
      name={icon}
      color={icon === "bookmark" ? "gray.600" : "primary.light"}
    />
    {hasText && (
      <Text color={icon === "bookmark" ? "text.dark" : "primary.light"}>
        {actionText}
      </Text>
    )}
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
            actionText="Bookmarked"
            action={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          />
        ) : (
          <StyledButton
            variant="outline-gray"
            hasText={hasText}
            icon="bookmark"
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
