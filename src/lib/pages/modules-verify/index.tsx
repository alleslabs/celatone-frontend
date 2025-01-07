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

import { useCelatoneApp, useInitiaL1, useMobile } from "lib/app-provider";
import { ControllerInput } from "lib/components/forms";
import { FooterCta } from "lib/components/layouts";
import { NoMobile } from "lib/components/modal";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { useMoveVerifyTaskStore } from "lib/providers/store";
import { useSubmitMoveVerify } from "lib/services/verification/move";

import {
  ModuleVerifyFileMap,
  ModuleVerifyModalBody,
  ModuleVerifyTop,
  ModuleVerifyUploadFolder,
  ModuleVerifyUploadFolderInfo,
} from "./components";
import type { ModuleVerifyForm } from "./types";
import { zModuleVerifyForm } from "./types";
import { generateFileMap } from "./utils";

export const ModulesVerify = observer(() => {
  const router = useRouter();
  const isMobile = useMobile();
  const { currentChainId } = useCelatoneApp();
  const { isError, isLoading, mutateAsync } = useSubmitMoveVerify();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { addMoveVerifyTask } = useMoveVerifyTaskStore();
  useInitiaL1({ shouldRedirect: true });

  const { control, handleSubmit, setValue, watch } = useForm<ModuleVerifyForm>({
    defaultValues: {
      moveFiles: [],
    },
    mode: "all",
    resolver: zodResolver(zModuleVerifyForm),
    reValidateMode: "onChange",
  });
  const { moveFiles, requestNote, tomlFile } = watch();

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

    const data = await mutateAsync(formData).catch(() => null);

    if (!data) return;

    setValue("taskId", data.id);
    addMoveVerifyTask({
      chainId: currentChainId,
      fileMap: JSON.parse(fileMap),
      requestNote,
      taskId: data.id,
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
                gridTemplateColumns="1fr 6fr 4fr 1fr"
                p={12}
                columnGap={8}
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
                    helperText="A short description for this verification request, stored locally on your device."
                    label="Request Note (Optional)"
                    name="requestNote"
                    variant="fixed-floating"
                    control={control}
                    placeholder="ex. My first lending modules"
                  />
                </Box>
              </Grid>
            </Box>
          </PageContainer>
          <Box
            zIndex={2}
            borderColor="gray.700"
            borderTop="1px"
            bottom={0}
            position="sticky"
          >
            <FooterCta
              cancelLabel="Cancel"
              sx={{
                "> div": {
                  gridArea: "1 / 2",
                  width: "100%",
                },
                backgroundColor: "background.main",
                columnGap: "32px",
                display: "grid",
                gridTemplateColumns: "1fr 6fr 4fr 1fr",
                maxWidth: "1440px",
                mx: "auto",
                px: "48px",
              }}
              actionButton={{
                isDisabled: !zModuleVerifyForm.safeParse(watch()).success,
                onClick: handleSubmit(handleSubmitForm),
              }}
              actionLabel="Upload file and Submit"
              cancelButton={{
                onClick: router.back,
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
});
