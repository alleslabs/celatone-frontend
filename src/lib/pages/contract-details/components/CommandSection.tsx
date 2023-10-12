import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Spinner,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { useInternalNavigate } from "lib/app-provider";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { CustomIcon } from "lib/components/icon";
import {
  EditSchemaButtons,
  JsonSchemaModal,
  ViewSchemaModal,
} from "lib/components/json-schema";
import { Tooltip } from "lib/components/Tooltip";
import { useExecuteCmds, useQueryCmds } from "lib/hooks";
import { useSchemaStore } from "lib/providers/store";
import type { ContractAddr } from "lib/types";
import { encode, jsonPrettify } from "lib/utils";

interface CommandSectionProps {
  contractAddress: ContractAddr;
  codeHash: string;
  codeId: string;
}

export const CommandSection = observer(
  ({ contractAddress, codeHash, codeId }: CommandSectionProps) => {
    const navigate = useInternalNavigate();
    const { isOpen, onClose, onOpen } = useDisclosure();

    const { getSchemaByCodeHash } = useSchemaStore();
    const jsonSchema = getSchemaByCodeHash(codeHash);
    const attached = Boolean(jsonSchema);

    const { isFetching: isQueryCmdsFetching, queryCmds } =
      useQueryCmds(contractAddress);
    const { isFetching: isExecuteCmdsFetching, execCmds } =
      useExecuteCmds(contractAddress);
    const renderCmds = (
      isFetching: boolean,
      cmds: [string, string][],
      type: string
    ) => {
      if (isFetching) {
        return <Spinner size="md" mx={1} />;
      }
      if (cmds.length) {
        return (
          <ButtonGroup
            width="90%"
            flexWrap="wrap"
            rowGap={2}
            sx={{
              "> button": {
                marginInlineStart: "0 !important",
                marginInlineEnd: "1",
              },
            }}
          >
            {cmds.sort().map(([cmd, msg]) => (
              <ContractCmdButton
                key={`${type}-cmd-${cmd}`}
                cmd={cmd}
                onClickCmd={() => {
                  navigate({
                    pathname: `/${type}`,
                    query: {
                      contract: contractAddress,
                      msg: encode(jsonPrettify(msg)),
                    },
                  });
                }}
              />
            ))}
          </ButtonGroup>
        );
      }
      return (
        <Text variant="body2" color="text.dark">
          No messages available
        </Text>
      );
    };

    return (
      <Flex direction="column" gap={6}>
        <Flex gap={4} alignItems="center">
          <Heading as="h6" variant="h6" minW="fit-content">
            Available command shortcuts
          </Heading>
          {attached ? (
            <Flex
              display={{ base: "none", md: "flex" }}
              alignItems="center"
              justify="flex-start"
              w="full"
              gap={1}
            >
              <Tag variant="gray" gap={1} mr={1}>
                <CustomIcon name="check-circle" boxSize={3} color="gray.600" />
                <Text variant="body3">Attached Schema to Code ID {codeId}</Text>
              </Tag>
              <ViewSchemaModal isIcon codeId={codeId} jsonSchema={jsonSchema} />
              <EditSchemaButtons
                codeId={codeId}
                codeHash={codeHash}
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
                variant="outline-gray"
                size="sm"
                onClick={onOpen}
                display={{ base: "none", md: "flex" }}
              >
                Attach JSON Schema
              </Button>
            </Tooltip>
          )}
        </Flex>
        <Flex
          gap={{ base: 4, md: 6 }}
          direction={{ base: "column", md: "row" }}
        >
          <Flex
            direction="column"
            bg="gray.900"
            p={4}
            borderRadius="8px"
            flex={0.5}
          >
            <Text color="text.dark" variant="body2" fontWeight={500} mb={2}>
              Query Shortcuts
            </Text>
            {renderCmds(isQueryCmdsFetching, queryCmds, "query")}
          </Flex>
          <Flex
            direction="column"
            bg="gray.900"
            p={4}
            borderRadius="8px"
            flex={0.5}
          >
            <Text color="text.dark" variant="body2" fontWeight={500} mb={2}>
              Execute Shortcuts
            </Text>
            {renderCmds(isExecuteCmdsFetching, execCmds, "execute")}
          </Flex>
        </Flex>
        <JsonSchemaModal
          isOpen={isOpen}
          onClose={onClose}
          codeId={codeId}
          codeHash={codeHash}
          isReattach={attached}
        />
      </Flex>
    );
  }
);
