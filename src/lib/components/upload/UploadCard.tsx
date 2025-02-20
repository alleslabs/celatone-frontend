import { Flex, IconButton, Text } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon, UploadIcon } from "lib/components/icon";
import { big } from "lib/types";
import type { Nullable } from "lib/types";

import { useCardTheme } from "./hooks/useCardTheme";
import type { CardTheme, Status } from "./types";

interface UploadCardProps {
  file: File;
  deleteFile: () => void;
  theme?: CardTheme;
  status?: Status;
  statusText?: Nullable<string>;
}

export const UploadCard = ({
  file,
  deleteFile,
  theme = "primary",
  status,
  statusText,
}: UploadCardProps) => {
  const { themeConfig, statusColor } = useCardTheme(theme, status);

  return (
    <>
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
        <Flex gap={5}>
          <UploadIcon />
          <Flex direction="column">
            <Text variant="body1">{file.name}</Text>
            <Text variant="body2" color="text.dark" display="flex" gap="4px">
              {big(file.size)
                .div(1000)
                .toFixed(file.size > 1000 ? 0 : undefined)}{" "}
              KB
            </Text>
          </Flex>
        </Flex>
        <Flex align="center" gap={4}>
          <IconButton
            variant="ghost-error"
            size="sm"
            icon={<CustomIcon name="delete" boxSize={4} />}
            onClick={() => {
              track(AmpEvent.USE_REMOVE_UPLOAD_FILE);
              deleteFile();
            }}
            aria-label="upload card"
            sx={{
              color: "gray.600",
              _hover: {
                color: "error.main",
                backgroundColor: "error.background",
              },
            }}
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
      {status && (
        <Text variant="body3" color={statusColor} mt={1}>
          {statusText}
        </Text>
      )}
    </>
  );
};
