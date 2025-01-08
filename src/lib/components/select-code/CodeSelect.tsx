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
import { getWasmVerifyStatus } from "lib/utils";

import { CodeSelectDrawerButton } from "./CodeSelectDrawerButton";

interface CodeSelectProps extends Omit<FlexProps, "onSelect"> {
  codeId: number;
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
  const name = getCodeLocalInfo(codeId)?.name;
  const { data } = useCodeLcd(codeId, {
    enabled: !!codeId,
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
        borderWidth="1px"
        align="center"
        gap={4}
        p={4}
        w="100%"
        bgColor="gray.900"
        borderColor={isError ? "error.main" : "gray.700"}
        borderRadius="8px"
      >
        <UploadIcon variant={codeId ? "primary" : "muted"} />
        {codeId ? (
          <Flex w="60%" direction="column">
            <Text
              variant="body1"
              whiteSpace="nowrap"
              fontWeight={500}
              overflow="hidden"
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
            <Flex>
              <WasmVerifyBadge
                hasText
                status={getWasmVerifyStatus(wasmDerivedVerifyInfos)}
                relatedVerifiedCodes={
                  wasmDerivedVerifyInfos?.relatedVerifiedCodes
                }
              />
            </Flex>
          </Flex>
        ) : (
          <Text variant="body1" fontWeight={500}>
            Please select code
          </Text>
        )}
        <CodeSelectDrawerButton
          buttonText={codeId ? "Change Code" : "Select Code"}
          onCodeSelect={onCodeSelect}
        />
      </Flex>

      {isError && (
        <Text ml={3} mt={1} variant="body3" color="error.main">
          {status.message}
        </Text>
      )}
    </Flex>
  );
};
