import { Button, Flex, Text } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon, UploadIcon } from "lib/components/icon";
import { big } from "lib/types";
import type { Nullable } from "lib/types";

import { useCardTheme } from "./hooks/useCardTheme";
import type { CardTheme, Status } from "./types";

interface UploadCardProps {
  deleteFile: () => void;
  file: File;
  status?: Status;
  statusText?: Nullable<string>;
  theme?: CardTheme;
}

export const UploadCard = ({
  deleteFile,
  file,
  status,
  statusText,
  theme = "primary",
}: UploadCardProps) => {
  const { statusColor, themeConfig } = useCardTheme(theme, status);

  return (
    <>
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
        <Flex gap={5}>
          <UploadIcon />
          <Flex direction="column">
            <Text variant="body1">{file.name}</Text>
            <Text display="flex" gap="4px" variant="body2" color="text.dark">
              {big(file.size)
                .div(1000)
                .toFixed(file.size > 1000 ? 0 : undefined)}{" "}
              KB
            </Text>
          </Flex>
        </Flex>
        <Flex align="center" gap={4}>
          <Button
            size="sm"
            variant={themeConfig.buttonVariant}
            leftIcon={<CustomIcon name="delete" boxSize={3} />}
            onClick={() => {
              track(AmpEvent.USE_REMOVE_UPLOAD_FILE);
              deleteFile();
            }}
          >
            Remove file
          </Button>
          {status === "error" && (
            <CustomIcon
              name="alert-triangle-solid"
              boxSize={4}
              color="error.main"
            />
          )}
        </Flex>
      </Flex>
      {status && (
        <Text mt={1} variant="body3" color={statusColor}>
          {statusText}
        </Text>
      )}
    </>
  );
};
