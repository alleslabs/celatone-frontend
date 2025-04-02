import type { FlexProps } from "@chakra-ui/react";
import type { FormStatus } from "lib/components/forms";
import type { Code } from "lib/services/types";
import type { Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { UploadIcon } from "lib/components/icon";
import { useCodeStore } from "lib/providers/store";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { useCodeRest } from "lib/services/wasm/code";
import { AccessConfigPermission } from "lib/types";
import { getWasmVerifyStatus } from "lib/utils";

import { DotSeparator } from "../DotSeparator";
import { PermissionChip } from "../PermissionChip";
import { WasmVerifyBadge } from "../WasmVerifyBadge";
import { CodeSelectDrawerButton } from "./CodeSelectDrawerButton";

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
        bgColor="gray.900"
        borderColor={isError ? "error.main" : "gray.700"}
        borderRadius="8px"
        borderWidth="1px"
        gap={4}
        p={4}
        w="100%"
      >
        <UploadIcon variant={codeId ? "primary" : "muted"} />
        {codeId ? (
          <Flex direction="column" w="60%">
            <Text
              fontWeight={500}
              overflow="hidden"
              textOverflow="ellipsis"
              variant="body1"
              whiteSpace="nowrap"
            >
              {name ?? "Untitled Name"}
            </Text>
            <Flex alignItems="center" gap={2}>
              <Text color="text.dark" variant="body2">
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
                relatedVerifiedCodes={
                  wasmDerivedVerifyInfos?.relatedVerifiedCodes
                }
                status={getWasmVerifyStatus(wasmDerivedVerifyInfos)}
              />
            </Flex>
          </Flex>
        ) : (
          <Text fontWeight={500} variant="body1">
            Please select code
          </Text>
        )}
        <CodeSelectDrawerButton
          buttonText={codeId ? "Change Code" : "Select Code"}
          onCodeSelect={onCodeSelect}
        />
      </Flex>

      {isError && (
        <Text color="error.main" ml={3} mt={1} variant="body3">
          {status.message}
        </Text>
      )}
    </Flex>
  );
};
