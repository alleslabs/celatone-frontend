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
  const { mutateAsync, isError, isLoading } = useSubmitMoveVerify();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addMoveVerifyTask } = useMoveVerifyTaskStore();
  useInitiaL1({ shouldRedirect: true });

  const { control, watch, handleSubmit, setValue } = useForm<ModuleVerifyForm>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: zodResolver(zModuleVerifyForm),
    defaultValues: {
      moveFiles: [],
    },
  });
  const { moveFiles, tomlFile, requestNote } = watch();

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
});
