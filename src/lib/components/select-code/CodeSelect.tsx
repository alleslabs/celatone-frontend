import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { DotSeparator } from "../DotSeparator";
import { PermissionChip } from "../PermissionChip";
import { WasmVerifyBadge } from "../WasmVerifyBadge";
import type { FormStatus } from "lib/components/forms";
import { UploadIcon } from "lib/components/icon";
import { useCodeStore } from "lib/providers/store";
import type { Code } from "lib/services/types";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { useCodeLcd } from "lib/services/wasm/code";
import { AccessConfigPermission } from "lib/types";
import { getWasmVerifyStatus, isId } from "lib/utils";

import { CodeSelectDrawerButton } from "./CodeSelectDrawerButton";

interface CodeSelectProps extends Omit<FlexProps, "onSelect"> {
  onCodeSelect: (code: string) => void;
  setCodeHash: (data: Code) => void;
  codeId: string;
  status: FormStatus;
}

export const CodeSelect = ({
  onCodeSelect,
  setCodeHash,
  codeId,
  status,
  ...componentProps
}: CodeSelectProps) => {
  const { getCodeLocalInfo } = useCodeStore();
  const name = getCodeLocalInfo(Number(codeId))?.name;
  const { data } = useCodeLcd(Number(codeId), {
    enabled: isId(codeId),
    onSuccess: setCodeHash,
  });

  const { data: wasmDerivedVerifyInfos } = useDerivedWasmVerifyInfo(
    Number(codeId),
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
              {name ?? "Untitled Name"}
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
            <WasmVerifyBadge
              status={getWasmVerifyStatus(wasmDerivedVerifyInfos)}
              relatedVerifiedCodes={
                wasmDerivedVerifyInfos?.relatedVerifiedCodes
              }
              hasText
            />
          </Flex>
        ) : (
          <Text variant="body1" fontWeight={500}>
            Please select code
          </Text>
        )}
        <CodeSelectDrawerButton
          onCodeSelect={onCodeSelect}
          buttonText={codeId ? "Change Code" : "Select Code"}
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
