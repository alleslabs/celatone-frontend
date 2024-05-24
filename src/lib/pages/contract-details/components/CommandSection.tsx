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
import { useExecuteCmds } from "lib/hooks";
import { useSchemaStore } from "lib/providers/store";
import { useContractQueryMsgsLcd } from "lib/services/wasm/contract";
import type { BechAddr32 } from "lib/types";
import { encode, jsonPrettify } from "lib/utils";

interface RenderCmdsProps {
  isFetching: boolean;
  cmds: [string, string][];
  contractAddress: BechAddr32;
  type: string;
}

interface CommandSectionProps {
  contractAddress: BechAddr32;
  codeHash: string;
  codeId: number;
}

const RenderCmds = ({
  isFetching,
  cmds,
  contractAddress,
  type,
}: RenderCmdsProps) => {
  const navigate = useInternalNavigate();

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

export const CommandSection = observer(
  ({ contractAddress, codeHash, codeId }: CommandSectionProps) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const { getSchemaByCodeHash } = useSchemaStore();
    const jsonSchema = getSchemaByCodeHash(codeHash);
    const attached = Boolean(jsonSchema);

    const { isFetching: isQueryCmdsFetching, data: queryCmds = [] } =
      useContractQueryMsgsLcd(contractAddress);
    const { isFetching: isExecuteCmdsFetching, execCmds } =
      useExecuteCmds(contractAddress);

    return (
      <Flex
        direction="column"
        gap={4}
        pb={{ base: 0, md: 8 }}
        borderBottom={{ base: "0px", md: "1px solid" }}
        borderBottomColor={{ base: "transparent", md: "gray.700" }}
      >
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
            <RenderCmds
              isFetching={isQueryCmdsFetching}
              cmds={queryCmds}
              contractAddress={contractAddress}
              type="query"
            />
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
            <RenderCmds
              isFetching={isExecuteCmdsFetching}
              cmds={execCmds}
              contractAddress={contractAddress}
              type="execute"
            />
          </Flex>
        </Flex>
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
