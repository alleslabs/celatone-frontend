import { Box, Grid } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { ControllerInput } from "lib/components/forms";
import { FooterCta } from "lib/components/layouts";
import { NoMobile } from "lib/components/modal";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";

import {
  ModuleVerifyFileMap,
  ModuleVerifyTop,
  ModuleVerifyUploadFolder,
  ModuleVerifyUploadFolderInfo,
} from "./components";

export const ModulesVerify = () => {
  const { control } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      requestNote: "",
    },
  });

  return (
    <>
      <NoMobile />
      <CelatoneSeo pageName="Modules Verify" />
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
              <ModuleVerifyUploadFolder />
            </Box>
            <Box gridArea="2 / 3">
              <ModuleVerifyUploadFolderInfo />
            </Box>
            <Box gridArea="3 / 2">
              <ModuleVerifyFileMap />
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
      <Box position="sticky" bottom={0} borderTop="1px" borderColor="gray.700">
        <FooterCta
          cancelButton={{
            onClick: () => null,
          }}
          cancelLabel="Cancel"
          actionButton={{
            onClick: () => null,
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
    </>
  );
};
