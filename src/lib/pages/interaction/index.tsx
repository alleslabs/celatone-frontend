import type { FlexProps } from "@chakra-ui/react";
import { useDisclosure, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { CountBadge } from "lib/components/module/CountBadge";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";
import type { IndexedModule } from "lib/services/moduleService";
import type { ExposedFunction } from "lib/types";
import { parseJsonABI } from "lib/utils/abi";

import {
  ModuleSelectDrawerTrigger,
  ModuleSelectDrawer,
} from "./component/drawer";
import {
  InteractionTypeSwitch,
  InteractionTabs,
} from "./component/InteractionTypeSwitch";

const containerBaseStyle: FlexProps = {
  direction: "column",
  bgColor: "gray.900",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  gap: 4,
};

export const Interaction = () => {
  const { query, isReady } = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [tab, setTab] = useState<InteractionTabs>();
  const [module, setModule] = useState<IndexedModule>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFn, setSelectedFn] = useState<ExposedFunction>();

  const abi = module ? parseJsonABI(module.abi) : undefined;

  const handleModuleSelect = useCallback(
    (selectedModule: IndexedModule, fn?: ExposedFunction) => {
      setModule(selectedModule);
      setSelectedFn(fn);
    },
    []
  );

  useEffect(() => {
    if (isReady) {
      setTab(
        query.type === "execute"
          ? InteractionTabs.EXECUTE_MODULE
          : InteractionTabs.VIEW_MODULE
      );
    }
  }, [isReady, query.type]);

  return (
    <PageContainer>
      <Heading as="h5" variant="h5">
        Module Interactions
      </Heading>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        bgColor="gray.900"
        p={4}
        borderRadius={4}
        my={8}
      >
        {module ? (
          <>
            <Flex direction="column" gap={4}>
              <LabelText label="Module Path" labelWeight={600}>
                <Flex align="center" gap={1}>
                  <Text variant="body1">{module.address}</Text>
                  <CustomIcon
                    name="chevron-right"
                    color="gray.600"
                    boxSize={3}
                  />
                  <Text variant="body1" fontWeight={700}>
                    {module.moduleName}
                  </Text>
                </Flex>
              </LabelText>
              <LabelText label="Friends" labelWeight={600}>
                <Text variant="body2" color="gray.400">
                  {abi?.friends.join(" , ")}
                </Text>
              </LabelText>
            </Flex>
            <Flex direction="column" gap={2}>
              <ModuleSelectDrawerTrigger
                triggerVariant="change-module"
                buttonText="Change Module"
                onOpen={onOpen}
              />
              <Button
                variant="ghost-gray"
                rightIcon={
                  <CustomIcon name="launch" boxSize={3} color="text.dark" />
                }
                // TODO: Link to module section in account page
                onClick={() => {}}
              >
                View Module
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <p>Select module to interact with ...</p>
            <ModuleSelectDrawerTrigger
              triggerVariant="select-module"
              onOpen={onOpen}
            />
          </>
        )}
        <ModuleSelectDrawer
          isOpen={isOpen}
          onClose={onClose}
          handleModuleSelect={handleModuleSelect}
        />
      </Flex>
      <Flex borderTop="1px solid" borderColor="gray.700" py={8} gap={8}>
        {/* Left side */}
        <Flex direction="column" flex={0.2}>
          <Flex alignItems="center" gap={2}>
            <Text variant="body2" fontWeight={600}>
              Available functions
            </Text>
            <CountBadge variant="common" count={0} />
          </Flex>
          <InteractionTypeSwitch currentTab={tab} onTabChange={setTab} my={3} />
          <Flex {...containerBaseStyle} p={4} height="full">
            <EmptyState
              imageWidth="80px"
              imageVariant="empty"
              message="Available functions for selected modules will display here"
              textVariant="body2"
            />
          </Flex>
        </Flex>
        {/* Right side */}
        <Flex {...containerBaseStyle} flex={0.8} py={24}>
          <EmptyState
            imageWidth="80px"
            imageVariant="empty"
            message={`Initiate your Module interactions by choosing a module and its associated function. ${"\n"} This section will showcase the input or response type required for the functions.`}
            textVariant="body2"
          />
          <Button variant="primary">Select Module</Button>
        </Flex>
      </Flex>
    </PageContainer>
  );
};
