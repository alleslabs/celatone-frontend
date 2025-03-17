import {
  Box,
  Grid,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { useCelatoneApp, useMobile, useMoveConfig } from "lib/app-provider";
import { ControllerInput } from "lib/components/forms";
import { FooterCta } from "lib/components/layouts";
import { Loading } from "lib/components/Loading";
import { NoMobile } from "lib/components/modal";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching } from "lib/components/state";
import { useMoveVerifyTaskStore } from "lib/providers/store";
import {
  useSubmitMoveVerify,
  useMoveVerifyConfig,
} from "lib/services/verification/move";

import type { MoveVerifyConfig } from "lib/types";
import {
  ModuleVerifyFileMap,
  ModuleVerifyModalBody,
  ModuleVerifyTop,
  ModuleVerifyUploadFolder,
  ModuleVerifyUploadFolderInfo,
} from "./components";
import { ModuleVerifyAdvancedOptions } from "./components/ModuleVerifyAdvancedOptions";
import { generateFileMap } from "./helpers";
import type { ModuleVerifyForm } from "./types";
import { zModuleVerifyForm } from "./types";

interface ModulesVerifyBodyProps {
  moveVerifyConfig: MoveVerifyConfig;
}

export const ModulesVerifyBody = observer(
  ({ moveVerifyConfig }: ModulesVerifyBodyProps) => {
    const router = useRouter();
    const isMobile = useMobile();
    const { currentChainId } = useCelatoneApp();
    const { mutateAsync, isError, isLoading } = useSubmitMoveVerify();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { addMoveVerifyTask } = useMoveVerifyTaskStore();

    const { control, watch, handleSubmit, setValue } =
      useForm<ModuleVerifyForm>({
        mode: "all",
        reValidateMode: "onChange",
        resolver: zodResolver(zModuleVerifyForm),
        defaultValues: {
          moveFiles: [],
          bytecodeVersion: moveVerifyConfig.defaultBytecodeVersion,
          compilerVersion: moveVerifyConfig.defaultCompilerVersion,
          languageVersion: moveVerifyConfig.defaultLanguageVersion,
        },
      });

    const {
      moveFiles,
      tomlFile,
      requestNote,
      bytecodeVersion,
      compilerVersion,
      languageVersion,
    } = watch();

    const handleSubmitForm = async () => {
      onOpen();

      const formData = new FormData();
      formData.append("chainId", currentChainId);
      formData.append("files", tomlFile);

      moveFiles.forEach((file) => {
        formData.append("files", file);
      });

      const fileMap = generateFileMap(tomlFile, moveFiles);
      formData.append("fileMap", fileMap);
      formData.append("bytecodeVersion", bytecodeVersion.toString());
      formData.append("compilerVersion", compilerVersion);
      formData.append("languageVersion", languageVersion);

      const data = await mutateAsync(formData).catch(() => null);

      if (!data) return;

      setValue("taskId", data.id);
      addMoveVerifyTask({
        taskId: data.id,
        chainId: currentChainId,
        requestNote,
        fileMap: JSON.parse(fileMap),
      });
    };

    return (
      <>
        <CelatoneSeo pageName="Modules Verify" />
        {isMobile ? (
          <NoMobile />
        ) : (
          <>
            <PageContainer p={0}>
              <Box minH="inherit" maxW="1440px" mx="auto">
                <Grid
                  gridTemplateColumns="1fr 6fr 4fr 1fr"
                  rowGap={10}
                  columnGap={8}
                  p={12}
                >
                  <Box gridArea="1 / 2">
                    <ModuleVerifyTop />
                  </Box>
                  <Box gridArea="2 / 2">
                    <ModuleVerifyUploadFolder control={control} />
                  </Box>
                  <Box gridArea="2 / 3" gridRowEnd="span 3">
                    <ModuleVerifyUploadFolderInfo />
                  </Box>
                  <Box gridArea="3 / 2">
                    <ModuleVerifyFileMap control={control} />
                  </Box>
                  <Box gridArea="4 / 2">
                    <ControllerInput
                      name="requestNote"
                      control={control}
                      label="Request Note (Optional)"
                      variant="fixed-floating"
                      placeholder="ex. My first lending modules"
                      helperText="A short description for this verification request, stored locally on your device."
                    />
                  </Box>
                  <Box gridArea="5 / 2">
                    <ModuleVerifyAdvancedOptions
                      control={control}
                      setValue={setValue}
                      moveVerifyConfig={moveVerifyConfig}
                    />
                  </Box>
                </Grid>
              </Box>
            </PageContainer>
            <Box
              position="sticky"
              bottom={0}
              borderTop="1px"
              borderColor="gray.700"
              zIndex={2}
            >
              <FooterCta
                cancelButton={{
                  onClick: router.back,
                }}
                cancelLabel="Cancel"
                actionButton={{
                  onClick: handleSubmit(handleSubmitForm),
                  isDisabled: !zModuleVerifyForm.safeParse(watch()).success,
                }}
                actionLabel="Upload file and Submit"
                sx={{
                  backgroundColor: "background.main",
                  columnGap: "32px",
                  px: "48px",
                  display: "grid",
                  gridTemplateColumns: "1fr 6fr 4fr 1fr",
                  maxWidth: "1440px",
                  mx: "auto",
                  "> div": {
                    width: "100%",
                    gridArea: "1 / 2",
                  },
                }}
              />
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent w="645px" bg="gray.800" maxW="100vw" py={10}>
                <ModuleVerifyModalBody
                  isError={isError}
                  isLoading={isLoading}
                  onClose={onClose}
                  control={control}
                />
              </ModalContent>
            </Modal>
          </>
        )}
      </>
    );
  }
);

export const ModulesVerify = () => {
  useMoveConfig({ shouldRedirect: true });
  const { data: moveVerifyConfig, isLoading } = useMoveVerifyConfig();

  if (isLoading) return <Loading />;
  if (!moveVerifyConfig) return <ErrorFetching dataName="Move verify config" />;

  return <ModulesVerifyBody moveVerifyConfig={moveVerifyConfig} />;
};
