import type { Addr, ExposedFunction, IndexedModule } from "lib/types";
import type { Dispatch, SetStateAction } from "react";

import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
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
import { useModuleByAddressRest } from "lib/services/move/module";
import { useMoveVerifyInfo } from "lib/services/verification/move";
import { resolveMoveVerifyStatus } from "lib/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { InteractQueryParams } from "./types";

import {
  InteractionBodySection,
  InteractionBodySectionMobile,
  InteractionTabs,
  ModuleSelectDrawer,
  ModuleSelectDrawerTrigger,
} from "./component";
import { ModuleSelectDrawerMobile } from "./component/drawer/ModuleSelectDrawerMobile";
import { SelectedFunctionCard } from "./component/SelectedFunctionCard";
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
    direction="column"
    gap={4}
    mt={2}
    pt={4}
  >
    <Flex direction="column" gap={2}>
      <Flex alignItems="center" gap={2}>
        <Text as="h6" fontWeight={600} variant="h6">
          Selected Function
        </Text>
        <Button
          leftIcon={<CustomIcon boxSize={3} name="swap" />}
          px={1}
          size="sm"
          variant={isZeroState ? "ghost-gray" : "ghost-primary"}
          onClick={() =>
            handleDrawerOpen?.(ModuleInteractionMobileStep.SelectFunction)
          }
        >
          Change Function
        </Button>
      </Flex>
      {selectedFn && setSelectedFn && (
        <FunctionCard
          exposedFn={selectedFn}
          isReadOnly
          variant="readonly"
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
        borderRadius={8}
        color="text.dark"
        justifyContent="center"
        p={4}
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
    alignItems={{ md: "center" }}
    direction={{ base: "column", md: "row" }}
    gap={4}
    justifyContent={{ md: "space-between" }}
    w="full"
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
      handleSetSelectedType((fn?.is_view ?? true) ? "view" : "execute");

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

  const { refetch } = useModuleByAddressRest({
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
        docHref="move/view-execute"
        title={isMobile ? "View module" : "Module interactions"}
      />
      <Flex
        alignItems="center"
        bgColor="gray.900"
        borderRadius={4}
        justifyContent="space-between"
        mb={8}
        p={4}
      >
        {module ? (
          <Flex
            alignItems={{ md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 0 }}
            justifyContent={{ md: "space-between" }}
            w="full"
          >
            <Flex direction="column" gap={4}>
              <LabelText
                label="Module path"
                labelColor="text.main"
                labelWeight={600}
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
                    boxSize={3}
                    color="gray.600"
                    name="chevron-right"
                  />
                  <Text display="inline-flex" fontWeight={700} variant="body1">
                    {module.moduleName}
                  </Text>
                </Flex>
              </LabelText>
              <LabelText
                label="Friends"
                labelColor="text.main"
                labelWeight={600}
              >
                <Flex gap={1} wordBreak="break-all">
                  {module.parsedAbi.friends.length ? (
                    <Flex
                      display="inline"
                      sx={{
                        "> p:last-child > span": {
                          display: "none",
                        },
                      }}
                    >
                      {module.parsedAbi.friends.map((item) => (
                        <Text
                          key={item}
                          color="gray.400"
                          display="inline-flex"
                          variant="body2"
                        >
                          {item}
                          <span>,&nbsp;</span>
                        </Text>
                      ))}
                    </Flex>
                  ) : (
                    <Text color="gray.400" variant="body2">
                      -
                    </Text>
                  )}
                </Flex>
              </LabelText>
            </Flex>
            <Flex direction={{ base: "row", md: "column" }} gap={2}>
              <ModuleSelectDrawerTrigger
                buttonText="Change module"
                triggerVariant="change-module"
                onOpen={() =>
                  handleDrawerOpen(ModuleInteractionMobileStep.SelectModule)
                }
              />
              <Button
                rightIcon={
                  <CustomIcon boxSize={3} color="text.dark" name="launch" />
                }
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
            handleModuleSelect={handleModuleSelect}
            hexAddress={module?.address}
            isOpen={isOpen}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
            setStep={setStep}
            step={step}
            onClose={onClose}
          />
        ) : (
          <ModuleSelectDrawer
            handleModuleSelect={handleModuleSelect}
            hexAddress={module?.address}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      </Flex>
      {isMobile ? (
        <InteractionBodySectionMobile
          module={module}
          openDrawer={onOpen}
          selectedFn={selectedFn}
        />
      ) : (
        <InteractionBodySection
          handleFunctionSelect={handleFunctionSelect}
          module={module}
          selectedFn={selectedFn}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
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
