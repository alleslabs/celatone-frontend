import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

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
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState } from "lib/components/state";
import { useOpenNewTab } from "lib/hooks";
import { useModuleByAddressLcd } from "lib/services/move/module";
import { useMoveVerifyInfo } from "lib/services/verification/move";
import type { Addr, ExposedFunction, IndexedModule } from "lib/types";
import { resolveMoveVerifyStatus } from "lib/utils";

import {
  InteractionBodySection,
  InteractionBodySectionMobile,
  InteractionTabs,
  ModuleSelectDrawer,
  ModuleSelectDrawerTrigger,
} from "./component";
import { ModuleSelectDrawerMobile } from "./component/drawer/ModuleSelectDrawerMobile";
import { SelectedFunctionCard } from "./component/SelectedFunctionCard";
import type { InteractQueryParams } from "./types";
import { ModuleInteractionMobileStep, zInteractQueryParams } from "./types";

const FunctionSection = ({
  handleDrawerOpen,
  isZeroState,
  selectedFn,
  setSelectedFn,
}: {
  handleDrawerOpen?: (step: ModuleInteractionMobileStep) => void;
  isZeroState?: boolean;
  selectedFn?: ExposedFunction;
  setSelectedFn?: Dispatch<SetStateAction<ExposedFunction | undefined>>;
}) => (
  <Flex
    gap={4}
    mt={2}
    pt={4}
    borderTop="1px solid"
    borderTopColor="gray.700"
    direction="column"
  >
    <Flex gap={2} direction="column">
      <Flex alignItems="center" gap={2}>
        <Text as="h6" variant="h6" fontWeight={600}>
          Selected Function
        </Text>
        <Button
          px={1}
          size="sm"
          variant={isZeroState ? "ghost-gray" : "ghost-primary"}
          leftIcon={<CustomIcon name="swap" boxSize={3} />}
          onClick={() =>
            handleDrawerOpen?.(ModuleInteractionMobileStep.SelectFunction)
          }
        >
          Change Function
        </Button>
      </Flex>
      {selectedFn && setSelectedFn && (
        <FunctionCard
          isReadOnly
          variant="readonly"
          exposedFn={selectedFn}
          onFunctionSelect={() => {
            setSelectedFn(selectedFn);
          }}
        />
      )}
    </Flex>
    {selectedFn ? (
      <SelectedFunctionCard fn={selectedFn} />
    ) : (
      <Flex
        alignItems="center"
        bg="background.main"
        p={4}
        borderRadius={8}
        color="text.dark"
        justifyContent="center"
      >
        Please select module first
      </Flex>
    )}
  </Flex>
);

const ZeroState = ({
  isMobile,
  onOpen,
}: {
  isMobile: boolean;
  onOpen: () => void;
}) => (
  <Flex
    alignItems={{ md: "center" }}
    gap={4}
    w="full"
    direction={{ base: "column", md: "row" }}
    justifyContent={{ md: "space-between" }}
  >
    <p>Select a module to interact with ...</p>
    <ModuleSelectDrawerTrigger triggerVariant="select-module" onOpen={onOpen} />
    {isMobile && <FunctionSection isZeroState />}
  </Flex>
);

const InteractBody = ({
  address,
  functionName,
  functionType,
  moduleName,
}: InteractQueryParams) => {
  const router = useRouter();
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  const openNewTab = useOpenNewTab();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [module, setModule] = useState<IndexedModule>();
  const [selectedType, setSelectedType] = useState<InteractionTabs>(
    InteractionTabs.VIEW_MODULE
  );
  const [selectedFn, setSelectedFn] = useState<ExposedFunction>();

  const [step, setStep] = useState(ModuleInteractionMobileStep.SelectModule);
  const [selectedModule, setSelectedModule] = useState<IndexedModule>();

  const handleDrawerOpen = (selectedStep: ModuleInteractionMobileStep) => {
    setStep(selectedStep);
    onOpen();
  };

  const handleSetSelectedType = (type: string) =>
    setSelectedType(
      type === "execute"
        ? InteractionTabs.EXECUTE_MODULE
        : InteractionTabs.VIEW_MODULE
    );

  const handleModuleSelect = useCallback(
    (selectedModuleInput: IndexedModule, fn?: ExposedFunction) => {
      setModule(selectedModuleInput);
      setSelectedFn(fn);
      handleSetSelectedType(fn?.is_view ?? true ? "view" : "execute");

      navigate({
        options: { shallow: true },
        pathname: "/interact",
        query: {
          address: selectedModuleInput.address,
          moduleName: selectedModuleInput.moduleName,
          ...(fn && { functionName: fn.name }),
        },
      });
    },
    [navigate]
  );

  const handleFunctionSelect = useCallback(
    (fn: ExposedFunction) => {
      setSelectedFn(fn);
      navigate({
        options: { shallow: true },
        pathname: "/interact",
        query: {
          ...router.query,
          functionName: fn.name,
        },
      });
    },
    [navigate, router.query]
  );

  const { data: verificationData } = useMoveVerifyInfo(
    module?.address,
    module?.moduleName
  );

  const { refetch } = useModuleByAddressLcd({
    address: address as Addr,
    moduleName,
    options: {
      enabled: false,
      onSuccess: (data) => {
        setModule(data);
        if (functionName) {
          const fn = data.parsedAbi.exposed_functions.find(
            (exposedFn) => exposedFn.name === functionName
          );
          if (fn) {
            handleSetSelectedType(fn.is_view ? "view" : "execute");
            setSelectedFn(fn);
          }
        } else if (functionType) {
          handleSetSelectedType(functionType);
        }
      },
      refetchOnWindowFocus: false,
      retry: false,
    },
  });

  const moveVerifyStatus = useMemo(
    () => resolveMoveVerifyStatus(module?.digest, verificationData?.digest),
    [module?.digest, verificationData?.digest]
  );

  useEffect(() => {
    if (!!address && !!moduleName) refetch();
    else {
      setModule(undefined);
      setSelectedType(InteractionTabs.VIEW_MODULE);
      setSelectedFn(undefined);
    }
  }, [address, moduleName, refetch]);

  useEffect(() => {
    if (router.isReady)
      trackToModuleInteraction(
        !!address,
        !!moduleName,
        !!verificationData,
        !!functionName,
        functionType
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // For ModuleSelectDrawerMobile
  useEffect(() => {
    if (!module || !isMobile || !router.isReady) return;

    setSelectedModule(module);

    if (!selectedFn)
      handleDrawerOpen(ModuleInteractionMobileStep.SelectFunction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, module]);

  return (
    <>
      <CelatoneSeo pageName="View / Execute Module" />
      <PageHeader
        title={isMobile ? "View Module" : "Module Interactions"}
        docHref="move/view-execute"
      />
      <Flex
        alignItems="center"
        mb={8}
        p={4}
        bgColor="gray.900"
        borderRadius={4}
        justifyContent="space-between"
      >
        {module ? (
          <Flex
            alignItems={{ md: "center" }}
            gap={{ base: 4, md: 0 }}
            w="full"
            direction={{ base: "column", md: "row" }}
            justifyContent={{ md: "space-between" }}
          >
            <Flex gap={4} direction="column">
              <LabelText
                label="Module Path"
                labelWeight={600}
                labelColor="text.main"
              >
                <Flex align="center" display="inline" gap={1}>
                  <Text
                    display="inline-flex"
                    variant="body1"
                    wordBreak="break-all"
                  >
                    {module.address}
                  </Text>
                  <CustomIcon
                    name="chevron-right"
                    boxSize={3}
                    color="gray.600"
                  />
                  <Text display="inline-flex" variant="body1" fontWeight={700}>
                    {module.moduleName}
                  </Text>
                </Flex>
              </LabelText>
              <LabelText
                label="Friends"
                labelWeight={600}
                labelColor="text.main"
              >
                <Text variant="body2" color="gray.400">
                  {JSON.stringify(module.parsedAbi.friends)}
                </Text>
              </LabelText>
            </Flex>
            <Flex gap={2} direction={{ base: "row", md: "column" }}>
              <ModuleSelectDrawerTrigger
                triggerVariant="change-module"
                buttonText="Change Module"
                onOpen={() =>
                  handleDrawerOpen(ModuleInteractionMobileStep.SelectModule)
                }
              />
              <Button
                size={{ base: "sm", md: "md" }}
                variant="ghost-gray"
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
                rightIcon={
                  <CustomIcon name="launch" boxSize={3} color="text.dark" />
                }
              >
                See Module
              </Button>
            </Flex>
            {isMobile && selectedFn && (
              <FunctionSection
                handleDrawerOpen={handleDrawerOpen}
                selectedFn={selectedFn}
                setSelectedFn={setSelectedFn}
              />
            )}
          </Flex>
        ) : (
          <ZeroState isMobile={isMobile} onOpen={onOpen} />
        )}
        {isMobile ? (
          <ModuleSelectDrawerMobile
            hexAddress={module?.address}
            isOpen={isOpen}
            setStep={setStep}
            step={step}
            handleModuleSelect={handleModuleSelect}
            onClose={onClose}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
          />
        ) : (
          <ModuleSelectDrawer
            hexAddress={module?.address}
            isOpen={isOpen}
            handleModuleSelect={handleModuleSelect}
            onClose={onClose}
          />
        )}
      </Flex>
      {isMobile ? (
        <InteractionBodySectionMobile
          selectedFn={selectedFn}
          module={module}
          openDrawer={onOpen}
        />
      ) : (
        <InteractionBodySection
          selectedFn={selectedFn}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          handleFunctionSelect={handleFunctionSelect}
          module={module}
          onOpen={onOpen}
        />
      )}
      <Box pt="32px">
        <ModuleSourceCode
          moveVerifyStatus={moveVerifyStatus}
          verificationData={verificationData}
        />
      </Box>
    </>
  );
};

export const Interact = () => {
  useMoveConfig({ shouldRedirect: true });
  const router = useRouter();
  const validated = zInteractQueryParams.safeParse(router.query);

  return (
    <PageContainer>
      {validated.success ? (
        <InteractBody {...validated.data} />
      ) : (
        <EmptyState
          heading="Invalid Address or Name Format"
          imageVariant="not-found"
          message="Please ensure that you have entered a valid format."
        />
      )}
    </PageContainer>
  );
};
