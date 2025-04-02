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
  codeId: number;
  schema: Option<CodeSchema>;
  isIcon?: boolean;
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
  schema,
  isIcon = false,
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
            variant="ghost-gray"
            size="sm"
            onClick={handleView}
            color="gray.600"
            icon={<CustomIcon name="view" boxSize={5} />}
            aria-label="view schema"
          />
        </Tooltip>
      ) : (
        <Button variant="outline-gray" size="sm" onClick={handleView}>
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
                View JSON schema for code ID “{codeId}”
              </Heading>
            </Flex>
            <AppLink
              href={`/codes/${codeId}/schema`}
              onClick={() => trackUseViewJSON("code_details_schema")}
            >
              <Button mr={8} gap={1} size="sm" variant="outline-gray">
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
              orientation="vertical"
              onChange={trackTabOnChange}
            >
              <TabList>
                <StyledCustomTab>Full schema</StyledCustomTab>
                {SchemaMsgTabList.map((schemaProperty) => (
                  <StyledCustomTab key={schemaProperty}>
                    {capitalize(schemaProperty)}Msg
                  </StyledCustomTab>
                ))}
              </TabList>
              <TabPanels pl={6}>
                <StyledTabPanel>
                  <ViewSchemaPanel jsonSchema={schema} codeId={codeId} />
                </StyledTabPanel>
                {SchemaMsgTabList.map((schemaProperty) => (
                  <StyledTabPanel key={schemaProperty}>
                    <ViewSchemaPanel
                      jsonSchema={schema?.[schemaProperty]}
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
