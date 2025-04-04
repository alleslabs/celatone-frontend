import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import type { FormStatus } from "lib/components/forms";
import { UploadIcon } from "lib/components/icon";
import { useCodeStore } from "lib/providers/store";
import type { Code } from "lib/services/types";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { useCodeRest } from "lib/services/wasm/code";
import type { Option } from "lib/types";
import { AccessConfigPermission } from "lib/types";
import { getWasmVerifyStatus } from "lib/utils";

import { CodeSelectDrawerButton } from "./CodeSelectDrawerButton";
import { DotSeparator } from "../DotSeparator";
import { PermissionChip } from "../PermissionChip";
import { WasmVerifyBadge } from "../WasmVerifyBadge";

interface CodeSelectProps extends Omit<FlexProps, "onSelect"> {
  codeId: Option<number>;
  onCodeSelect: (code: number) => void;
  setCodeHash: (data: Code) => void;
  status: FormStatus;
}

export const CodeSelect = ({
  codeId,
  onCodeSelect,
  setCodeHash,
  status,
  ...componentProps
}: CodeSelectProps) => {
  const { getCodeLocalInfo } = useCodeStore();
  const name = codeId ? getCodeLocalInfo(codeId)?.name : undefined;
  const { data } = useCodeRest(codeId, {
    onSuccess: setCodeHash,
  });

  const { data: wasmDerivedVerifyInfos } = useDerivedWasmVerifyInfo(
    codeId,
    data?.hash
  );

  const isError = status.state === "error";
  return (
    <Flex direction="column" {...componentProps}>
      <Flex
        align="center"
        p={4}
        gap={4}
        w="100%"
        bgColor="gray.900"
        borderRadius="8px"
        borderWidth="1px"
        borderColor={isError ? "error.main" : "gray.700"}
      >
        <UploadIcon variant={codeId ? "primary" : "muted"} />
        {codeId ? (
          <Flex direction="column" w="60%">
            <Text
              variant="body1"
              fontWeight={500}
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {name ?? "Untitled name"}
            </Text>
            <Flex alignItems="center" gap={2}>
              <Text variant="body2" color="text.dark">
                Code ID {codeId}
              </Text>
              <DotSeparator />
              <PermissionChip
                instantiatePermission={
                  data?.instantiatePermission ?? AccessConfigPermission.UNKNOWN
                }
                permissionAddresses={data?.permissionAddresses ?? []}
              />
            </Flex>
            <Flex>
              <WasmVerifyBadge
                status={getWasmVerifyStatus(wasmDerivedVerifyInfos)}
                relatedVerifiedCodes={
                  wasmDerivedVerifyInfos?.relatedVerifiedCodes
                }
                hasText
              />
            </Flex>
          </Flex>
        ) : (
          <Text variant="body1" fontWeight={500}>
            Please select code
          </Text>
        )}
        <CodeSelectDrawerButton
          onCodeSelect={onCodeSelect}
          buttonText={codeId ? "Change code" : "Select code"}
        />
      </Flex>

      {isError && (
        <Text variant="body3" color="error.main" mt={1} ml={3}>
          {status.message}
        </Text>
      )}
    </Flex>
  );
};
