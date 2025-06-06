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
  hasText?: boolean;
  slug: string;
}

const buttonTextProps: CSSProperties = {
  borderRadius: "8px",
  height: "auto",
  minWidth: "auto",
};

const buttonIconProps: CSSProperties = {
  borderRadius: "full",
  height: "fit-content",
  minWidth: "fit-content",
  padding: "2px",
};

const toastIcon = <CustomIcon color="success.main" name="check-circle-solid" />;

interface StyledButtonProps {
  action: (e: MouseEvent<HTMLButtonElement>) => void;
  actionText: string;
  hasText: boolean;
  icon: IconKeys;
  variant: string;
}

const StyledButton = ({
  action,
  actionText,
  hasText,
  icon,
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
  ({ details, hasText = true, slug }: BookmarkButtonProps) => {
    const { isPublicProjectSaved, removePublicProject, savePublicProject } =
      usePublicProjectStore();
    const toast = useToast({
      duration: 5000,
      icon: toastIcon,
      isClosable: false,
      position: "bottom-right",
      status: "success",
    });

    const handleSave = useCallback(() => {
      track(AmpEvent.PUBLIC_SAVE);
      savePublicProject({
        logo: details?.logo || "",
        name: details?.name || "",
        slug,
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
