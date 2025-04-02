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
import { UserDocsLink } from "lib/components/UserDocsLink";
import Image from "next/image";

export const ModuleVerifyUploadFolderInfo = () => (
  <Accordion allowToggle defaultIndex={[0]} top={0} variant="transparent">
    <AccordionItem>
      <AccordionButton>
        <Text
          color="text.main"
          fontWeight={700}
          textAlign="start"
          variant="body2"
        >
          What should I include in my folder?
        </Text>
        <AccordionIcon color="gray.600" ml="auto" />
      </AccordionButton>
      <AccordionPanel
        bg="transparent"
        borderColor="gray.700"
        borderStyle="solid"
        borderTopWidth="1px"
        px={0}
      >
        <Stack gap={3}>
          <Text color="text.dark" variant="body2">
            Please ensure that you upload the folder in the correct format,
            which should include:
          </Text>
          <AspectRatio maxH="150px" ratio={16 / 9}>
            <Image
              alt="Verify module uploading folder structure"
              fill
              objectFit="contain"
              objectPosition="left"
              src="/verify-module-task-folder.png"
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
        isDevTool
        mt={0}
      />
    </AccordionItem>
  </Accordion>
);
