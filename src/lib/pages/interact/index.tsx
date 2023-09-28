import {
  Grid,
  useDisclosure,
  Button,
  Flex,
  Heading,
  Text,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { ModuleSourceCode } from "lib/components/module";
import PageContainer from "lib/components/PageContainer";
import type { IndexedModule } from "lib/services/move/moduleService";
import {
  useAccountModules,
  useVerifyModule,
} from "lib/services/move/moduleService";
import type {
  ExposedFunction,
  HexAddr,
  MoveAccountAddr,
  Option,
} from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import {
  ModuleSelectDrawerTrigger,
  ModuleSelectDrawer,
  FunctionSelectPanel,
  FunctionSelectBody,
  InteractionTabs,
} from "./component";

export const Interact = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [module, setModule] = useState<IndexedModule>();
  const [selectedType, setSelectedType] = useState<InteractionTabs>(
    InteractionTabs.VIEW_MODULE
  );
  const [selectedFn, setSelectedFn] = useState<ExposedFunction>();

  const handleSetSelectedType = (type: string) =>
    setSelectedType(
      type === "execute"
        ? InteractionTabs.EXECUTE_MODULE
        : InteractionTabs.VIEW_MODULE
    );

  const handleModuleSelect = useCallback(
    (selectedModule: IndexedModule, fn?: ExposedFunction) => {
      setModule(selectedModule);
      setSelectedFn(fn);
      navigate({
        pathname: "/interact",
        query: {
          address: selectedModule.address,
          moduleName: selectedModule.moduleName,
          ...(fn && { functionName: fn.name }),
        },
        options: { shallow: true },
      });
    },
    [navigate]
  );

  const handleFunctionSelect = useCallback(
    (fn: ExposedFunction) => {
      setSelectedFn(fn);
      navigate({
        pathname: "/interact",
        query: {
          ...router.query,
          functionName: fn.name,
        },
        options: { shallow: true },
      });
    },
    [navigate, router.query]
  );

  const { data: verificationData } = useVerifyModule({
    address: module?.address as Option<HexAddr>,
    moduleName: module?.moduleName,
  });

  const addressParam = getFirstQueryParam(router.query.address);
  const moduleNameParam = getFirstQueryParam(router.query.moduleName);
  const functionNameParam = getFirstQueryParam(router.query.functionName);
  const functionTypeParam = getFirstQueryParam(router.query.functionType);
  const { refetch } = useAccountModules({
    address: addressParam as MoveAccountAddr,
    moduleName: moduleNameParam,
    functionName: functionNameParam,
    options: {
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
      onSuccess: (data) => {
        if (!Array.isArray(data)) {
          setModule(data);
          if (functionNameParam) {
            const fn = [...data.viewFunctions, ...data.executeFunctions].find(
              (exposedFn) => exposedFn.name === functionNameParam
            );
            if (fn) {
              handleSetSelectedType(fn.is_view ? "view" : "execute");
              setSelectedFn(fn);
            }
          } else if (functionTypeParam)
            handleSetSelectedType(functionTypeParam);
        }
      },
    },
  });

  useEffect(() => {
    if (!!addressParam && !!moduleNameParam) refetch();
    else {
      setModule(undefined);
      setSelectedType(InteractionTabs.VIEW_MODULE);
      setSelectedFn(undefined);
    }
  }, [addressParam, moduleNameParam, refetch]);

  return (
    <>
      <PageContainer
        overflow="hidden"
        minH="unset"
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
                    <Text variant="body1">{module.address.toString()}</Text>
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
                    {JSON.stringify(module.parsedAbi.friends)}
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
            hexAddress={module?.address}
            handleModuleSelect={handleModuleSelect}
          />
        </Flex>
        <Grid
          gap={8}
          templateColumns="minmax(300px, 20%) 1fr"
          overflow="hidden"
        >
          {/* Left side */}
          <FunctionSelectPanel
            module={module}
            tab={selectedType}
            setTab={setSelectedType}
            selectedFn={selectedFn}
            setSelectedFn={handleFunctionSelect}
          />
          {/* Right side */}
          <FunctionSelectBody
            module={module}
            selectedFn={selectedFn}
            openDrawer={onOpen}
          />
        </Grid>
      </PageContainer>
      <Box px={{ base: "16px", md: "48px" }}>
        <ModuleSourceCode sourceCode={verificationData?.source} />
      </Box>
    </>
  );
};
