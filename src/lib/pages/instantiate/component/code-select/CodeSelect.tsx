import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { UploadIcon } from "lib/components/icon/UploadIcon";
import { useCodeStore } from "lib/hooks/store";
import { useUserKey } from "lib/hooks/useUserKey";

import { CodeSelectModalButton } from "./CodeSelectModalButton";

interface CodeSelectProps extends Omit<FlexProps, "onSelect"> {
  onCodeSelect: (code: string) => void;
  codeId: string;
}

export const CodeSelect = ({
  onCodeSelect,
  codeId,
  ...componentProps
}: CodeSelectProps) => {
  const { codeInfo } = useCodeStore();
  const userKey = useUserKey();
  const description = codeInfo?.[userKey]?.[Number(codeId)]?.description;
  return (
    <Flex
      align="center"
      p="16px"
      gap="16px"
      w="100%"
      bgColor="gray.900"
      borderRadius="4px"
      {...componentProps}
    >
      <UploadIcon variant={codeId ? "primary" : "muted"} />
      {codeId ? (
        <Flex direction="column" w="60%">
          <Text
            variant="body1"
            color="text.main"
            fontWeight={500}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {description ?? "No description"}
          </Text>
          <Text variant="body2" color="text.dark">
            Code ID {codeId}
          </Text>
        </Flex>
      ) : (
        <Text variant="body1" color="text.main" fontWeight={500}>
          Please select code
        </Text>
      )}

      <CodeSelectModalButton
        onCodeSelect={onCodeSelect}
        buttonText={codeId ? "Change" : "Select Code"}
      />
    </Flex>
  );
};
