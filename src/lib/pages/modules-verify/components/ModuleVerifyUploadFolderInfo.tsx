import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";

import { UserDocsLink } from "lib/components/UserDocsLink";

export const ModuleVerifyUploadFolderInfo = () => (
  <Accordion allowToggle defaultIndex={[0]} variant="transparent" top={0}>
    <AccordionItem>
      <AccordionButton>
        <Text
          variant="body2"
          fontWeight={700}
          color="text.main"
          textAlign="start"
        >
          What should I include in my folder?
        </Text>
        <AccordionIcon color="gray.600" ml="auto" />
      </AccordionButton>
      <AccordionPanel
        bg="transparent"
        borderTop="1px solid"
        borderColor="gray.700"
        px={0}
      >
        <Stack gap={3}>
          <Text color="text.dark" variant="body2">
            Please ensure that you upload the folder in the correct format,
            which should include:
          </Text>
          <AspectRatio ratio={16 / 9} maxH="150px">
            <Image
              src="/verify-module-task-folder.png"
              alt="Verify module uploading folder structure"
              objectFit="contain"
              objectPosition="left"
              fill
            />
          </AspectRatio>
          <Text color="text.dark" variant="body2">
            The folder can contain any additional files that will be used during
            verification (Optional)
          </Text>
        </Stack>
      </AccordionPanel>
      <UserDocsLink
        cta="See module verification guideline"
        href="initia/move/module-verification"
        mt={0}
        isDevTool
      />
    </AccordionItem>
  </Accordion>
);
