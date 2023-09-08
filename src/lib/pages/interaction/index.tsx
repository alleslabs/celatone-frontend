import {
  Grid,
  useDisclosure,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";

import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import PageContainer from "lib/components/PageContainer";
import type { IndexedModule } from "lib/services/moduleService";
import type { ExposedFunction } from "lib/types";
import { parseJsonABI } from "lib/utils/abi";

import {
  ModuleSelectDrawerTrigger,
  ModuleSelectDrawer,
  FunctionSelectPanel,
  FunctionSelectBody,
} from "./component";

export const Interaction = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [module, setModule] = useState<IndexedModule>();
  const [selectedFn, setSelectedFn] = useState<ExposedFunction>();

  const abi = module ? parseJsonABI(module.abi) : undefined;

  const handleModuleSelect = useCallback(
    (selectedModule: IndexedModule, fn?: ExposedFunction) => {
      setModule(selectedModule);
      setSelectedFn(fn);
    },
    []
  );

  return (
    <PageContainer
      overflow="hidden"
      minH="unset"
      maxH="calc(100vh - 129px)"
      display="grid"
      gridTemplateRows="auto auto 1fr"
    >
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
                  {abi?.friends ? JSON.stringify(abi.friends) : "N/A"}
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
            <p>Select a module to interact with ...</p>
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
      <Grid
        borderTop="1px solid"
        borderColor="gray.700"
        pt={8}
        gap={8}
        templateColumns="minmax(300px, 20%) 1fr"
        overflow="hidden"
      >
        {/* Left side */}
        <FunctionSelectPanel
          module={module}
          selectedFn={selectedFn}
          setSelectedFn={setSelectedFn}
        />
        {/* Right side */}
        <FunctionSelectBody module={module} selectedFn={selectedFn} />
      </Grid>
    </PageContainer>
  );
};
