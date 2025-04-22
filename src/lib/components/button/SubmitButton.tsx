import { Button } from "@chakra-ui/react";
import { useIsMac, useMobile } from "lib/app-provider";
import { useEffect } from "react";

import { CustomIcon } from "../icon";

interface SubmitButtonProps {
  isDisabled: boolean;
  isFullWidth?: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  text: string;
}

export const SubmitButton = ({
  isDisabled,
  isFullWidth = false,
  isLoading,
  onSubmit,
  text,
}: SubmitButtonProps) => {
  const isMobile = useMobile();
  const isMac = useIsMac();

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      // TODO: problem with safari if focusing in the textarea
      const specialKey = isMac ? e.metaKey : e.ctrlKey;
      if (!isDisabled && specialKey && e.key === "Enter") {
        onSubmit();
      }
    };
    document.addEventListener("keydown", keydownHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  });

  return (
    <Button
      fontSize="14px"
      isDisabled={isDisabled}
      isLoading={isLoading}
      leftIcon={<CustomIcon name="execute" />}
      p="6px 16px"
      sx={{ pointerEvents: isLoading && "none" }}
      variant="primary"
      w={isFullWidth ? "full" : "auto"}
      onClick={onSubmit}
    >
      {text} {!isMobile && `(${isMac ? "⌘" : "Ctrl"} + Enter)`}
    </Button>
  );
};
