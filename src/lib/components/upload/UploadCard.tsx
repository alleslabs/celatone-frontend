import type { Nullable } from "lib/types";

import { Flex, IconButton, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon, UploadIcon } from "lib/components/icon";
import { big } from "lib/types";

import type { CardTheme, Status } from "./types";

import { useCardTheme } from "./hooks/useCardTheme";

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
        bgColor={themeConfig.bgColor}
        border={themeConfig.border}
        borderColor={statusColor}
        borderRadius="8px"
        gap="16px"
        justifyContent="space-between"
        p="16px"
        w="full"
      >
        <Flex gap={5}>
          <UploadIcon />
          <Flex direction="column">
            <Text variant="body1">{file.name}</Text>
            <Text color="text.dark" display="flex" gap="4px" variant="body2">
              {big(file.size)
                .div(1000)
                .toFixed(file.size > 1000 ? 0 : undefined)}{" "}
              KB
            </Text>
          </Flex>
        </Flex>
        <Flex align="center" gap={4}>
          <IconButton
            aria-label="upload card"
            icon={<CustomIcon boxSize={4} name="delete" />}
            size="sm"
            sx={{
              color: "gray.600",
              _hover: {
                color: "error.main",
                backgroundColor: "error.background",
              },
            }}
            variant="ghost-error"
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
      {status && (
        <Text color={statusColor} mt={1} variant="body3">
          {statusText}
        </Text>
      )}
    </>
  );
};
