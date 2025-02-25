import { Button } from "@chakra-ui/react";
import { useEffect } from "react";

import { useIsMac, useMobile } from "lib/app-provider";
import { CustomIcon } from "../icon";

interface SubmitButtonProps {
  text: string;
  isLoading: boolean;
  onSubmit: () => void;
  isDisabled: boolean;
  isFullWidth?: boolean;
}

export const SubmitButton = ({
  text,
  isLoading,
  onSubmit,
  isDisabled,
  isFullWidth = false,
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
      w={isFullWidth ? "full" : "auto"}
      variant="primary"
      fontSize="14px"
      p="6px 16px"
      onClick={onSubmit}
      isDisabled={isDisabled}
      leftIcon={<CustomIcon name="execute" />}
      isLoading={isLoading}
      sx={{ pointerEvents: isLoading && "none" }}
    >
      {text} {!isMobile && `(${isMac ? "⌘" : "Ctrl"} + Enter)`}
    </Button>
  );
};
