import type { MoveVerifyConfig } from "lib/types";

import {
  Box,
  Grid,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import type { ModuleVerifyForm } from "./types";

import {
  ModuleVerifyFileMap,
  ModuleVerifyModalBody,
  ModuleVerifyTop,
  ModuleVerifyUploadFolder,
  ModuleVerifyUploadFolderInfo,
} from "./components";
import { ModuleVerifyAdvancedOptions } from "./components/ModuleVerifyAdvancedOptions";
import { generateFileMap } from "./helpers";
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
              <Box maxW="1440px" minH="inherit" mx="auto">
                <Grid
                  columnGap={8}
                  gridTemplateColumns="1fr 6fr 4fr 1fr"
                  p={12}
                  rowGap={10}
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
                      control={control}
                      helperText="A short description for this verification request, stored locally on your device."
                      label="Request Note (Optional)"
                      name="requestNote"
                      placeholder="ex. My first lending modules"
                      variant="fixed-floating"
                    />
                  </Box>
                  <Box gridArea="5 / 2">
                    <ModuleVerifyAdvancedOptions
                      control={control}
                      moveVerifyConfig={moveVerifyConfig}
                      setValue={setValue}
                    />
                  </Box>
                </Grid>
              </Box>
            </PageContainer>
            <Box
              borderColor="gray.700"
              borderStyle="solid"
              borderTopWidth="1px"
              bottom={0}
              position="sticky"
              zIndex={2}
            >
              <FooterCta
                actionButton={{
                  onClick: handleSubmit(handleSubmitForm),
                  isDisabled: !zModuleVerifyForm.safeParse(watch()).success,
                }}
                actionLabel="Upload file and Submit"
                cancelButton={{
                  onClick: router.back,
                }}
                cancelLabel="Cancel"
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
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent bg="gray.800" maxW="100vw" py={10} w="645px">
                <ModuleVerifyModalBody
                  control={control}
                  isError={isError}
                  isLoading={isLoading}
                  onClose={onClose}
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
