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
        <Flex gap={2} alignItems="center">
          <WasmVerifyBadge
            status={getWasmVerifyStatus(wasmVerifyInfo)}
            relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
            linkedCodeId={codeId}
          />
          <Heading as="h6" variant="h6" minW="fit-content">
            Verified command shortcuts
          </Heading>
          <ViewSchemaModal
            isIcon
            codeId={codeId}
            schema={wasmVerifyInfo?.schema}
          />
        </Flex>
      );

    const localSchema = getSchemaByCodeHash(codeHash);
    const attached = Boolean(localSchema);
    return (
      <Flex gap={4} alignItems="center">
        <Heading as="h6" variant="h6" minW="fit-content">
          Available command shortcuts
        </Heading>
        {localSchema ? (
          <Flex
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            justify="flex-start"
            w="full"
            gap={1}
          >
            <Tag variant="gray" gap={1} mr={1}>
              <CustomIcon
                name="check-circle-solid"
                boxSize={3}
                color="gray.600"
              />
              <Text variant="body3">Attached schema to code ID {codeId}</Text>
            </Tag>
            <ViewSchemaModal isIcon codeId={codeId} schema={localSchema} />
            <EditSchemaButtons
              codeId={codeId}
              codeHash={codeHash}
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
              variant="outline-gray"
              size="sm"
              onClick={onOpen}
              display={{ base: "none", md: "flex" }}
            >
              Attach JSON schema
            </Button>
          </Tooltip>
        )}
        <JsonSchemaModal
          codeId={codeId}
          codeHash={codeHash}
          isOpen={isOpen}
          isReattach={attached}
          onClose={onClose}
        />
      </Flex>
    );
  }
);
