import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  chakra,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { capitalize } from "lodash";

import { AppLink } from "../AppLink";
import { CustomIcon } from "../icon";
import { Tooltip } from "../Tooltip";
import { CustomTab } from "lib/components/CustomTab";
import type { CodeSchema } from "lib/stores/schema";
import { SchemaProperties } from "lib/stores/schema";
import type { Option } from "lib/types";

import { ViewSchemaPanel } from "./ViewSchemaPanel";

const StyledCustomTab = chakra(CustomTab, {
  baseStyle: {
    border: "unset",
    borderRadius: "4px",
    _selected: { bgColor: "gray.800" },
  },
});

const StyledTabPanel = chakra(TabPanel, {
  baseStyle: {
    p: 0,
  },
});

interface ViewSchemaModalProps {
  codeId: string;
  jsonSchema: Option<CodeSchema>;
  isAttached?: boolean;
  isIcon?: boolean;
}

const SchemaMsgTabList = [
  SchemaProperties.INSTANTIATE as "instantiate",
  SchemaProperties.EXECUTE as "execute",
  SchemaProperties.QUERY as "query",
  SchemaProperties.MIGRATE as "migrate",
];

export const ViewSchemaModal = ({
  codeId,
  jsonSchema,
  isAttached = true,
  isIcon = false,
}: ViewSchemaModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      {isIcon ? (
        <Tooltip label="View attached JSON schema">
          <IconButton
            variant="ghost-gray"
            size="sm"
            onClick={onOpen}
            color="gray.600"
            icon={<CustomIcon name="view" boxSize={5} />}
            aria-label="view schema"
          />
        </Tooltip>
      ) : (
        <Button variant="outline-gray" size="sm" onClick={onOpen}>
          View Schema
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent w="960px" h="680px">
          <ModalHeader justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" gap={2}>
              <CustomIcon name="view" boxSize={6} color="gray.600" />
              <Heading as="h5" variant="h5">
                View JSON Schema for code ID “{codeId}”
              </Heading>
            </Flex>
            {isAttached && (
              <AppLink href={`/codes/${codeId}/schema`}>
                <Button mr={8} gap={1} size="sm" variant="outline-gray">
                  <CustomIcon name="view" />
                  View in code detail
                </Button>
              </AppLink>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="unstyled" orientation="vertical">
              <TabList>
                <StyledCustomTab>Full Schema</StyledCustomTab>
                {SchemaMsgTabList.map((schemaProperty) => (
                  <StyledCustomTab key={schemaProperty}>
                    {capitalize(schemaProperty)}Msg
                  </StyledCustomTab>
                ))}
              </TabList>
              <TabPanels pl={6}>
                <StyledTabPanel>
                  <ViewSchemaPanel jsonSchema={jsonSchema} codeId={codeId} />
                </StyledTabPanel>
                {SchemaMsgTabList.map((schemaProperty) => (
                  <StyledTabPanel>
                    <ViewSchemaPanel
                      jsonSchema={jsonSchema?.[schemaProperty]}
                      codeId={codeId}
                    />
                  </StyledTabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
