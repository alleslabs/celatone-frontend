import type { IconKeys } from "lib/components/icon";
import type { Option, PublicDetail } from "lib/types";
import type { CSSProperties, MouseEvent } from "react";

import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { usePublicProjectStore } from "lib/providers/store";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

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

const toastIcon = <CustomIcon color="success.main" name="check-circle-solid" />;

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
    style={hasText ? buttonTextProps : buttonIconProps}
    gap={2}
    padding={{ base: "4px", md: "6px 16px" }}
    size={{ base: "xs", md: "md" }}
    variant={hasText ? variant : "ghost-gray"}
    onClick={action}
  >
    <CustomIcon
      color={icon === "bookmark" ? "gray.600" : "primary.light"}
      name={icon}
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
      track(AmpEvent.PUBLIC_SAVE);
      savePublicProject({
        name: details?.name || "",
        slug,
        logo: details?.logo || "",
      });
      toast({
        title: `Bookmarked \u2018${details?.name}\u2019 successfully`,
      });
    }, [savePublicProject, details?.name, details?.logo, slug, toast]);

    const handleRemove = useCallback(() => {
      track(AmpEvent.PUBLIC_REMOVE);
      removePublicProject(slug);
      toast({
        title: `\u2018${details?.name}\u2019 is removed from bookmark`,
      });
    }, [removePublicProject, slug, toast, details?.name]);

    return (
      <Flex alignItems="center">
        {isPublicProjectSaved(slug) ? (
          <StyledButton
            action={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            actionText="Bookmarked"
            hasText={hasText}
            icon="bookmark-solid"
            variant="outline-primary"
          />
        ) : (
          <StyledButton
            action={(e) => {
              if (details) {
                e.stopPropagation();
                handleSave();
              }
            }}
            actionText="Bookmark project"
            hasText={hasText}
            icon="bookmark"
            variant="outline-gray"
          />
        )}
      </Flex>
    );
  }
);
