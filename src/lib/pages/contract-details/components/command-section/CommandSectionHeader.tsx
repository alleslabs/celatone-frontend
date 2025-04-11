import type { Nullish, WasmVerifyInfo } from "lib/types";

import {
  Button,
  Flex,
  Heading,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import {
  EditSchemaButtons,
  JsonSchemaModal,
  ViewSchemaModal,
} from "lib/components/json-schema";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { useSchemaStore } from "lib/providers/store";
import { getWasmVerifyStatus } from "lib/utils";
import { observer } from "mobx-react-lite";

interface CommandSectionHeaderProps {
  codeId: number;
  codeHash: string;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CommandSectionHeader = observer(
  ({ codeId, codeHash, wasmVerifyInfo }: CommandSectionHeaderProps) => {
    const { getSchemaByCodeHash } = useSchemaStore();
    const { isOpen, onClose, onOpen } = useDisclosure();

    if (wasmVerifyInfo?.schema)
      return (
        <Flex alignItems="center" gap={2}>
          <WasmVerifyBadge
            linkedCodeId={codeId}
            relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
            status={getWasmVerifyStatus(wasmVerifyInfo)}
          />
          <Heading as="h6" minW="fit-content" variant="h6">
            Verified command shortcuts
          </Heading>
          <ViewSchemaModal
            codeId={codeId}
            isIcon
            schema={wasmVerifyInfo?.schema}
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
                boxSize={3}
                color="gray.600"
                name="check-circle-solid"
              />
              <Text variant="body3">Attached schema to code ID {codeId}</Text>
            </Tag>
            <ViewSchemaModal codeId={codeId} isIcon schema={localSchema} />
            <EditSchemaButtons
              codeHash={codeHash}
              codeId={codeId}
              openModal={onOpen}
            />
          </Flex>
        ) : (
          <Tooltip
            label={`Attached the JSON schema for code ${codeId}.`}
            minW="330px"
            textAlign="center"
          >
            <Button
              display={{ base: "none", md: "flex" }}
              size="sm"
              variant="outline-gray"
              onClick={onOpen}
            >
              Attach JSON schema
            </Button>
          </Tooltip>
        )}
        <JsonSchemaModal
          codeHash={codeHash}
          codeId={codeId}
          isOpen={isOpen}
          isReattach={attached}
          onClose={onClose}
        />
      </Flex>
    );
  }
);
