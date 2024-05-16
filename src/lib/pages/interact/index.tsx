import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { AmpEvent, track, trackToModuleInteraction } from "lib/amplitude";
import {
  useInternalNavigate,
  useMobile,
  useMoveConfig,
} from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { FunctionCard, ModuleSourceCode } from "lib/components/module";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { useOpenNewTab } from "lib/hooks";
import {
  useModuleByAddressLcd,
  useVerifyModule,
} from "lib/services/move/moduleService";
import type { Addr, ExposedFunction, IndexedModule } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import {
  InteractionBodySection,
  InteractionBodySectionMobile,
  InteractionTabs,
  ModuleSelectDrawer,
  ModuleSelectDrawerTrigger,
} from "./component";
import { ModuleSelectDrawerMobile } from "./component/drawer/ModuleSelectDrawerMobile";
import { SelectedFunctionCard } from "./component/SelectedFunctionCard";

export const ZeroState = ({
  onOpen,
  isMobile,
}: {
  onOpen: () => void;
  isMobile: boolean;
}) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      alignItems={{ md: "center" }}
      justifyContent={{ md: "space-between" }}
      w="full"
      gap={4}
    >
      <p>Select a module to interact with ...</p>
      <ModuleSelectDrawerTrigger
        triggerVariant="select-module"
        onOpen={onOpen}
      />
      {isMobile && (
        <Flex
          borderTop="1px solid"
          borderTopColor="gray.700"
          pt={4}
          direction="column"
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h6" variant="h6" fontWeight={600}>
              Selected Function
            </Heading>
            <Button
              size="sm"
              variant="ghost-gray"
              leftIcon={<CustomIcon name="swap" boxSize={3} />}
            >
              Change
            </Button>
          </Flex>
          <Flex
            p={4}
            borderRadius={8}
            alignItems="center"
            justifyContent="center"
            bg="background.main"
            color="text.dark"
            mt={2}
          >
            Please select module first
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export const Interact = () => {
  useMoveConfig({ shouldRedirect: true });

  const router = useRouter();
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const openNewTab = useOpenNewTab();

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
      handleSetSelectedType(fn?.is_view ?? true ? "view" : "execute");

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
    address: module?.address,
    moduleName: module?.moduleName,
  });

  const addressParam = getFirstQueryParam(router.query.address);
  const moduleNameParam = getFirstQueryParam(router.query.moduleName);
  const functionNameParam = getFirstQueryParam(router.query.functionName);
  const functionTypeParam = getFirstQueryParam(router.query.functionType);
  const { refetch } = useModuleByAddressLcd({
    address: addressParam as Addr,
    moduleName: moduleNameParam,
    options: {
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
      onSuccess: (data) => {
        setModule(data);
        if (functionNameParam) {
          const fn = data.parsedAbi.exposed_functions.find(
            (exposedFn) => exposedFn.name === functionNameParam
          );
          if (fn) {
            handleSetSelectedType(fn.is_view ? "view" : "execute");
            setSelectedFn(fn);
          }
        } else if (functionTypeParam) {
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

  useEffect(() => {
    if (router.isReady)
      trackToModuleInteraction(
        !!addressParam,
        !!moduleNameParam,
        !!verificationData,
        !!functionNameParam,
        functionTypeParam
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      <PageContainer
        overflow="hidden"
        minH="unset"
        display="grid"
        gridTemplateRows="auto auto 1fr"
      >
        <PageHeader
          title={isMobile ? "View Module" : "Module Interactions"}
          docHref="move/view-execute"
        />
        <Flex
          alignItems="center"
          justifyContent="space-between"
          bgColor="gray.900"
          p={4}
          borderRadius={4}
          mb={8}
        >
          {module ? (
            <Flex
              direction={{ base: "column", md: "row" }}
              alignItems={{ md: "center" }}
              justifyContent={{ md: "space-between" }}
              w="full"
              gap={{ base: 4, md: 0 }}
            >
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
              <Flex direction={{ base: "row", md: "column" }} gap={2}>
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
                  onClick={() => {
                    track(AmpEvent.USE_SEE_MODULE_BUTTON, {
                      isVerify: !!verificationData,
                    });
                    openNewTab({
                      pathname: `/modules/${module.address.toString()}/${
                        module.moduleName
                      }`,
                      query: {},
                    });
                  }}
                >
                  See Module
                </Button>
              </Flex>
              {isMobile && selectedFn && (
                <Flex
                  borderTop="1px solid"
                  borderTopColor="gray.700"
                  pt={4}
                  mt={2}
                  direction="column"
                  gap={4}
                >
                  <Flex direction="column" gap={2}>
                    <Flex gap={2} alignItems="center">
                      <Heading as="h6" variant="h6" fontWeight={600}>
                        Selected Function
                      </Heading>
                      <Button
                        size="sm"
                        variant="ghost-primary"
                        leftIcon={<CustomIcon name="swap" boxSize={3} />}
                        px={1}
                      >
                        Change
                      </Button>
                    </Flex>
                    <FunctionCard
                      variant="readonly"
                      exposedFn={selectedFn}
                      isReadOnly
                      onFunctionSelect={() => {
                        setSelectedFn(selectedFn);
                      }}
                    />
                  </Flex>
                  <SelectedFunctionCard fn={selectedFn} />
                </Flex>
              )}
            </Flex>
          ) : (
            <ZeroState onOpen={onOpen} isMobile={isMobile} />
          )}
          {isMobile ? (
            <ModuleSelectDrawerMobile
              isOpen={isOpen}
              onClose={onClose}
              hexAddress={module?.address}
              handleModuleSelect={handleModuleSelect}
            />
          ) : (
            <ModuleSelectDrawer
              isOpen={isOpen}
              onClose={onClose}
              hexAddress={module?.address}
              handleModuleSelect={handleModuleSelect}
            />
          )}
        </Flex>
        {isMobile ? (
          <InteractionBodySectionMobile
            module={module}
            selectedFn={selectedFn}
            openDrawer={onOpen}
          />
        ) : (
          <InteractionBodySection
            module={module}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedFn={selectedFn}
            handleFunctionSelect={handleFunctionSelect}
            onOpen={onOpen}
          />
        )}
      </PageContainer>
      <Box px={{ base: "16px", md: "48px" }}>
        <ModuleSourceCode sourceCode={verificationData?.source} />
      </Box>
    </>
  );
};
