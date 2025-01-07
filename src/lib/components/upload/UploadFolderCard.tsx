import { Flex, IconButton, Text } from "@chakra-ui/react";

import { CustomIcon, UploadFolderIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";

import { useCardTheme } from "./hooks/useCardTheme";
import type { CardTheme, Status } from "./types";

interface UploadFolderCardProps {
  deleteFile: () => void;
  fileName: string;
  status?: Status;
  theme?: CardTheme;
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
      gap="16px"
      p="16px"
      w="full"
      bgColor={themeConfig.bgColor}
      border={themeConfig.border}
      borderColor={statusColor}
      borderRadius="8px"
      justifyContent="space-between"
    >
      <Flex alignItems="center" gap={5}>
        <UploadFolderIcon />
        <Text variant="body1">{fileName}</Text>
      </Flex>
      <Flex align="center" gap={4}>
        <IconButton
          aria-label="reattach schema"
          size="sm"
          variant="ghost-gray-icon"
          icon={<CustomIcon name="delete" boxSize={4} />}
          onClick={() => {
            track(AmpEvent.USE_REMOVE_UPLOAD_FILE);
            deleteFile();
          }}
        />
        {status === "error" && (
          <CustomIcon
            name="alert-triangle-solid"
            boxSize={4}
            color="error.main"
          />
        )}
      </Flex>
    </Flex>
  );
};
