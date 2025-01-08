import { Flex, IconButton, Text } from "@chakra-ui/react";

import { CustomIcon, UploadFolderIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";

import { useCardTheme } from "./hooks/useCardTheme";
import type { CardTheme, Status } from "./types";

interface UploadFolderCardProps {
  fileName: string;
  deleteFile: () => void;
  theme?: CardTheme;
  status?: Status;
}

export const UploadFolderCard = ({
  fileName,
  deleteFile,
  theme = "primary",
  status,
}: UploadFolderCardProps) => {
  const { themeConfig, statusColor } = useCardTheme(theme, status);

  return (
    <Flex
      align="center"
      p="16px"
      gap="16px"
      w="full"
      bgColor={themeConfig.bgColor}
      border={themeConfig.border}
      borderColor={statusColor}
      borderRadius="8px"
      justifyContent="space-between"
    >
      <Flex gap={5} alignItems="center">
        <UploadFolderIcon />
        <Text variant="body1">{fileName}</Text>
      </Flex>
      <Flex align="center" gap={4}>
        <IconButton
          variant="ghost-gray-icon"
          size="sm"
          onClick={() => {
            track(AmpEvent.USE_REMOVE_UPLOAD_FILE);
            deleteFile();
          }}
          icon={<CustomIcon name="delete" boxSize={4} />}
          aria-label="reattach schema"
        />
        {status === "error" && (
          <CustomIcon
            name="alert-triangle-solid"
            color="error.main"
            boxSize={4}
          />
        )}
      </Flex>
    </Flex>
  );
};
