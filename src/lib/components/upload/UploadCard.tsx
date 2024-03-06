import { Button, Flex, Text } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon, UploadIcon } from "lib/components/icon";
import { big } from "lib/types";
import type { Nullable, Option } from "lib/types";

type CardTheme = "primary" | "secondary";

type Status = "error" | "info" | "init";

interface UploadCardProps {
  file: File;
  deleteFile: () => void;
  theme?: CardTheme;
  status?: Status;
  statusText?: Nullable<string>;
}

const getTheme = (theme: CardTheme) => {
  switch (theme) {
    case "secondary":
      return {
        bgColor: "gray.800",
        border: "1px solid var(--chakra-colors-gray-700)",
        buttonVariant: "outline-gray",
      };
    case "primary":
    default:
      return {
        bgColor: "gray.900",
        border: "none",
        buttonVariant: "outline-primary",
      };
  }
};

const resolveStatusColor = (status: Option<Status>): Option<string> => {
  switch (status) {
    case "error":
      return "error.main";
    case "info":
      return "primary.main";
    default:
      return undefined;
  }
};

export const UploadCard = ({
  file,
  deleteFile,
  theme = "primary",
  status,
  statusText,
}: UploadCardProps) => {
  const themeConfig = getTheme(theme);
  const statusColor = resolveStatusColor(status);
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
          <Button
            leftIcon={<CustomIcon name="delete" boxSize={3} />}
            size="sm"
            variant={themeConfig.buttonVariant}
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
