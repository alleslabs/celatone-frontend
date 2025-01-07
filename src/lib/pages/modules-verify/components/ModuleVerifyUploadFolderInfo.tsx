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
  <Accordion defaultIndex={[0]} variant="transparent" allowToggle top={0}>
    <AccordionItem>
      <AccordionButton>
        <Text
          textAlign="start"
          variant="body2"
          color="text.main"
          fontWeight={700}
        >
          What should I include in my folder?
        </Text>
        <AccordionIcon ml="auto" color="gray.600" />
      </AccordionButton>
      <AccordionPanel
        bg="transparent"
        px={0}
        borderColor="gray.700"
        borderTop="1px solid"
      >
        <Stack gap={3}>
          <Text variant="body2" color="text.dark">
            Please ensure that you upload the folder in the correct format,
            which should include:
          </Text>
          <AspectRatio maxH="150px" ratio={16 / 9}>
            <Image
              alt="Verify module uploading folder structure"
              fill
              src="/verify-module-task-folder.png"
              objectFit="contain"
              objectPosition="left"
            />
          </AspectRatio>
          <Text variant="body2" color="text.dark">
            The folder can contain any additional files that will be used during
            verification (Optional)
          </Text>
        </Stack>
      </AccordionPanel>
      <UserDocsLink
        cta="See module verification guideline"
        mt={0}
        href="initia/move/module-verification"
      />
    </AccordionItem>
  </Accordion>
);
