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
  selectedFn,
  setSelectedFn,
  isZeroState,
  handleDrawerOpen,
}: {
  selectedFn?: ExposedFunction;
  setSelectedFn?: Dispatch<SetStateAction<ExposedFunction | undefined>>;
  isZeroState?: boolean;
  handleDrawerOpen?: (step: ModuleInteractionMobileStep) => void;
}) => (
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
        <Text as="h6" variant="h6" fontWeight={600}>
          Selected Function
        </Text>
        <Button
          size="sm"
          variant={isZeroState ? "ghost-gray" : "ghost-primary"}
          leftIcon={<CustomIcon name="swap" boxSize={3} />}
          px={1}
          onClick={() =>
            handleDrawerOpen?.(ModuleInteractionMobileStep.SelectFunction)
          }
        >
          Change Function
        </Button>
      </Flex>
      {selectedFn && setSelectedFn && (
        <FunctionCard
          variant="readonly"
          exposedFn={selectedFn}
          isReadOnly
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
        p={4}
        borderRadius={8}
        alignItems="center"
        justifyContent="center"
        bg="background.main"
        color="text.dark"
      >
        Please select module first
      </Flex>
    )}
  </Flex>
);

const ZeroState = ({
  onOpen,
  isMobile,
}: {
  onOpen: () => void;
  isMobile: boolean;
}) => (
  <Flex
    direction={{ base: "column", md: "row" }}
    alignItems={{ md: "center" }}
    justifyContent={{ md: "space-between" }}
    w="full"
    gap={4}
  >
    <p>Select a module to interact with ...</p>
    <ModuleSelectDrawerTrigger triggerVariant="select-module" onOpen={onOpen} />
    {isMobile && <FunctionSection isZeroState />}
  </Flex>
);

const InteractBody = ({
  address,
  moduleName,
  functionName,
  functionType,
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
        pathname: "/interact",
        query: {
          address: selectedModuleInput.address,
          moduleName: selectedModuleInput.moduleName,
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

  const { data: verificationData } = useMoveVerifyInfo(
    module?.address,
    module?.moduleName
  );

  const { refetch } = useModuleByAddressLcd({
    address: address as Addr,
    moduleName,
    options: {
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
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

  useEffect(() => {
    if (!module || !isMobile || !router.isReady) return;

    setSelectedModule(module);
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
              <LabelText
                label="Module Path"
                labelWeight={600}
                labelColor="text.main"
              >
                <Flex align="center" gap={1} display="inline">
                  <Text
                    variant="body1"
                    display="inline-flex"
                    wordBreak="break-all"
                  >
                    {module.address}
                  </Text>
                  <CustomIcon
                    name="chevron-right"
                    color="gray.600"
                    boxSize={3}
                  />
                  <Text variant="body1" fontWeight={700} display="inline-flex">
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
            <Flex direction={{ base: "row", md: "column" }} gap={2}>
              <ModuleSelectDrawerTrigger
                triggerVariant="change-module"
                buttonText="Change Module"
                onOpen={() =>
                  handleDrawerOpen(ModuleInteractionMobileStep.SelectModule)
                }
              />
              <Button
                variant="ghost-gray"
                size={{ base: "sm", md: "md" }}
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
              <FunctionSection
                selectedFn={selectedFn}
                setSelectedFn={setSelectedFn}
                handleDrawerOpen={handleDrawerOpen}
              />
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
            step={step}
            setStep={setStep}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
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
      <Box pt="32px" px={{ base: "0", md: "48px" }}>
        <ModuleSourceCode
          verificationData={verificationData}
          moveVerifyStatus={moveVerifyStatus}
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
          imageVariant="not-found"
          heading="Invalid Address or Name Format"
          message="Please ensure that you have entered a valid format."
        />
      )}
    </PageContainer>
  );
};
