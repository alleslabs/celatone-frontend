import { Flex, IconButton, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";

import type { CardTheme, Status } from "./types";

import { CustomIcon, UploadFolderIcon } from "../icon";
import { useCardTheme } from "./hooks/useCardTheme";

interface UploadFolderCardProps {
  fileName: string;
  deleteFile: () => void;
  theme?: CardTheme;
  status?: Status;
}

export const UploadFolderCard = ({
  deleteFile,
  fileName,
  status,
  theme = "primary",
}: UploadFolderCardProps) => {
  const { statusColor, themeConfig } = useCardTheme(theme, status);

  return (
    <Flex
      align="center"
      bgColor={themeConfig.bgColor}
      border={themeConfig.border}
      borderColor={statusColor}
      borderRadius="8px"
      gap="16px"
      justifyContent="space-between"
      p="16px"
      w="full"
    >
      <Flex alignItems="center" gap={5}>
        <UploadFolderIcon />
        <Text variant="body1">{fileName}</Text>
      </Flex>
      <Flex align="center" gap={4}>
        <IconButton
          aria-label="reattach schema"
          icon={<CustomIcon boxSize={4} name="delete" />}
          size="sm"
          variant="ghost-gray-icon"
          onClick={() => {
            track(AmpEvent.USE_REMOVE_UPLOAD_FILE);
            deleteFile();
          }}
        />
        {status === "error" && (
          <CustomIcon
            boxSize={4}
            color="error.main"
            name="alert-triangle-solid"
          />
        )}
      </Flex>
    </Flex>
  );
};
