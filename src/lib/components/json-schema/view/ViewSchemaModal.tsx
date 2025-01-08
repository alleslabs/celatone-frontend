import {
  Button,
  chakra,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { useCallback } from "react";

import { AmpEvent, track, trackUseViewJSON } from "lib/amplitude";
import { AppLink } from "lib/components/AppLink";
import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { SchemaProperties } from "lib/types";
import type { CodeSchema, Option } from "lib/types";

import { ViewSchemaPanel } from "./ViewSchemaPanel";

const StyledCustomTab = chakra(CustomTab, {
  baseStyle: {
    _selected: { bgColor: "gray.800" },
    border: "unset",
    borderRadius: "4px",
  },
});

const StyledTabPanel = chakra(TabPanel, {
  baseStyle: {
    p: 0,
  },
});

interface ViewSchemaModalProps {
  codeId: number;
  isIcon?: boolean;
  schema: Option<CodeSchema>;
}

const SchemaMsgTabList = [
  SchemaProperties.INSTANTIATE,
  SchemaProperties.EXECUTE,
  SchemaProperties.QUERY,
  SchemaProperties.MIGRATE,
] as const;

const ALL_TABS = ["full schema", ...SchemaMsgTabList];

export const ViewSchemaModal = ({
  codeId,
  isIcon = false,
  schema,
}: ViewSchemaModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleView = useCallback(() => {
    onOpen();
    track(AmpEvent.USE_VIEW_ATTACHED_JSON, { tab: ALL_TABS[0] });
  }, [onOpen]);

  const trackTabOnChange = (index: number) => {
    track(AmpEvent.USE_VIEW_ATTACHED_JSON, {
      tab: ALL_TABS[index],
    });
  };

  return (
    <>
      {isIcon ? (
        <Tooltip label="View attached JSON schema">
          <IconButton
            aria-label="view schema"
            size="sm"
            variant="ghost-gray"
            color="gray.600"
            icon={<CustomIcon name="view" boxSize={5} />}
            onClick={handleView}
          />
        </Tooltip>
      ) : (
        <Button size="sm" variant="outline-gray" onClick={handleView}>
          View Schema
        </Button>
      )}
      <Modal
        isCentered
        isOpen={isOpen}
        size="4xl"
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent h="680px" w="960px">
          <ModalHeader alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" gap={2}>
              <CustomIcon name="view" boxSize={6} color="gray.600" />
              <Heading as="h5" variant="h5">
                View JSON Schema for code ID “{codeId}”
              </Heading>
            </Flex>
            <AppLink
              onClick={() => trackUseViewJSON("code_details_schema")}
              href={`/codes/${codeId}/schema`}
            >
              <Button gap={1} mr={8} size="sm" variant="outline-gray">
                <CustomIcon name="view" />
                View in code detail
              </Button>
            </AppLink>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Remark: It's identical to code detail */}
            <Tabs
              variant="unstyled"
              onChange={trackTabOnChange}
              orientation="vertical"
            >
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
                  <ViewSchemaPanel codeId={codeId} jsonSchema={schema} />
                </StyledTabPanel>
                {SchemaMsgTabList.map((schemaProperty) => (
                  <StyledTabPanel key={schemaProperty}>
                    <ViewSchemaPanel
                      codeId={codeId}
                      jsonSchema={schema?.[schemaProperty]}
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
