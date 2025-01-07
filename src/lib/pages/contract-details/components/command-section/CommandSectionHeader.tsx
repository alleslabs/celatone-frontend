import {
  Button,
  Flex,
  Heading,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { CustomIcon } from "lib/components/icon";
import {
  EditSchemaButtons,
  JsonSchemaModal,
  ViewSchemaModal,
} from "lib/components/json-schema";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { useSchemaStore } from "lib/providers/store";
import type { Nullish, WasmVerifyInfo } from "lib/types";
import { getWasmVerifyStatus } from "lib/utils";

interface CommandSectionHeaderProps {
  codeHash: string;
  codeId: number;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CommandSectionHeader = observer(
  ({ codeHash, codeId, wasmVerifyInfo }: CommandSectionHeaderProps) => {
    const { getSchemaByCodeHash } = useSchemaStore();
    const { isOpen, onClose, onOpen } = useDisclosure();

    if (wasmVerifyInfo?.schema)
      return (
        <Flex alignItems="center" gap={2}>
          <WasmVerifyBadge
            status={getWasmVerifyStatus(wasmVerifyInfo)}
            linkedCodeId={codeId}
            relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
          />
          <Heading as="h6" minW="fit-content" variant="h6">
            Verified command shortcuts
          </Heading>
          <ViewSchemaModal
            schema={wasmVerifyInfo?.schema}
            codeId={codeId}
            isIcon
          />
        </Flex>
      );

    const localSchema = getSchemaByCodeHash(codeHash);
    const attached = Boolean(localSchema);
    return (
      <Flex alignItems="center" gap={4}>
        <Heading as="h6" minW="fit-content" variant="h6">
          Available command shortcuts
        </Heading>
        {localSchema ? (
          <Flex
            alignItems="center"
            display={{ base: "none", md: "flex" }}
            gap={1}
            justify="flex-start"
            w="full"
          >
            <Tag gap={1} mr={1} variant="gray">
              <CustomIcon
                name="check-circle-solid"
                boxSize={3}
                color="gray.600"
              />
              <Text variant="body3">Attached Schema to Code ID {codeId}</Text>
            </Tag>
            <ViewSchemaModal schema={localSchema} codeId={codeId} isIcon />
            <EditSchemaButtons
              codeHash={codeHash}
              codeId={codeId}
              openModal={onOpen}
            />
          </Flex>
        ) : (
          <Tooltip
            label={`Attached the JSON Schema for code ${codeId}.`}
            minW="330px"
            textAlign="center"
          >
            <Button
              display={{ base: "none", md: "flex" }}
              size="sm"
              variant="outline-gray"
              onClick={onOpen}
            >
              Attach JSON Schema
            </Button>
          </Tooltip>
        )}
        <JsonSchemaModal
          isOpen={isOpen}
          isReattach={attached}
          codeHash={codeHash}
          codeId={codeId}
          onClose={onClose}
        />
      </Flex>
    );
  }
);
