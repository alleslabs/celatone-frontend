import { Flex, Text } from "@chakra-ui/react";
import big from "big.js";

import { CustomIcon, UploadIcon } from "lib/components/icon";
import type { Option } from "lib/types";

type CardTheme = "primary" | "secondary";

type Status = "error" | "info" | "init";

interface UploadCardProps {
  file: File;
  deleteFile: () => void;
  theme?: CardTheme;
  status?: Status;
  statusText?: string | null;
}

const getTheme = (theme: CardTheme) => {
  switch (theme) {
    case "secondary":
      return {
        bgColor: "gray.800",
        border: "1px solid var(--chakra-colors-gray-700)",
        iconColor: "gray.600",
      };
    case "primary":
    default:
      return {
        bgColor: "gray.900",
        border: "none",
        iconColor: "text.dark",
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
          <CustomIcon
            name="delete"
            color={themeConfig.iconColor}
            onClick={deleteFile}
            cursor="pointer"
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
