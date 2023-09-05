import {
  Text,
  Grid,
  GridItem,
  Heading,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Flex,
} from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";

import { UploadModuleCard } from "./components/UploadModuleCard";

export const PublishModule = () => {
  const {
    chainConfig: { prettyName: chainPrettyName },
  } = useCelatoneApp();

  const PUBLISH_MODULE_TEXT = {
    header: "Publish new module",
    description: `Upload .mv files to publish new module to ${chainPrettyName}. You can
    upload multiple .mv files to publish many modules within a
    transaction.`,
    connectWallet: "You need to connect wallet to proceed this action",
  };
  return (
    <Box as="main" p={{ base: "16px", md: "48px" }} minH="inherit">
      <Grid
        templateAreas={`"prespace main sidebar postspace"`}
        templateColumns="1fr 6fr 4fr 1fr"
      >
        <GridItem area="main">
          <Heading as="h5" variant="h5">
            {PUBLISH_MODULE_TEXT.header}
          </Heading>
          <Text color="text.dark" pt={4}>
            {PUBLISH_MODULE_TEXT.description}
          </Text>
          <ConnectWalletAlert
            subtitle={PUBLISH_MODULE_TEXT.connectWallet}
            mt={12}
          />
        </GridItem>
      </Grid>
      <Box position="relative" display="flex" mt={12}>
        <Box w="10%" />
        <Box w="60%">
          <Heading as="h6" variant="h6" fontWeight={800}>
            Upload .mv files(s)
          </Heading>
          <UploadModuleCard index={1} />
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit ameteiciendis
          incidunt error! Enim animi mollitia suscipit pariatur odio, eveniet
          cum ipsum! Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Ab, expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum!
        </Box>
        <Box w="5%" />
        <Box w="35%" position="relative">
          <Box position="sticky" top={0}>
            <Accordion
              position="relative"
              allowToggle
              width={96}
              defaultIndex={[0]}
              variant="transparent"
            >
              <AccordionItem borderTop="none" borderColor="gray.700">
                <AccordionButton py={3} px={0}>
                  <Text
                    variant="body2"
                    fontWeight={700}
                    color="text.main"
                    textAlign="start"
                  >
                    What should I provide in my .mv files?
                  </Text>
                  <AccordionIcon color="gray.600" ml="auto" />
                </AccordionButton>
                <AccordionPanel
                  bg="transparent"
                  py={3}
                  px={0}
                  borderTop="1px solid"
                  borderColor="gray.700"
                >
                  <Text variant="body2" color="text.dark" p={1}>
                    Your .mv files should consist of module name, available
                    functions and their properties, module mechanics, friends.
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </Box>
        <Box w="10%" />
      </Box>
      {/* Upgrade Policy */}
      <Box position="relative" display="flex" mt={12}>
        <Box w="10%" />
        <Box w="60%">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit ameteiciendis
          incidunt error! Enim animi mollitia suscipit pariatur odio, eveniet
          cum ipsum! Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Ab, expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum! Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Ab, expedita. Et molestiae odio
          explicabo excepturi numquam assumenda consectetur reiciendis incidunt
          error! Enim animi mollitia suscipit pariatur odio, eveniet cum ipsum!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
          expedita. Et molestiae odio explicabo excepturi numquam assumenda
          consectetur reiciendis incidunt error! Enim animi mollitia suscipit
          pariatur odio, eveniet cum ipsum!
        </Box>
        <Box w="5%" />
        <Box w="35%" position="relative">
          <Box position="sticky" top={0}>
            <Accordion
              position="relative"
              allowToggle
              width={96}
              defaultIndex={[0]}
              variant="transparent"
            >
              <AccordionItem borderTop="none" borderColor="gray.700">
                <AccordionButton py={3} px={0}>
                  <Text
                    variant="body2"
                    fontWeight={700}
                    color="text.main"
                    textAlign="start"
                  >
                    What is republishing module?
                  </Text>
                  <AccordionIcon color="gray.600" ml="auto" />
                </AccordionButton>
                <AccordionPanel
                  bg="transparent"
                  py={3}
                  px={0}
                  borderTop="1px solid"
                  borderColor="gray.700"
                >
                  <Text variant="body2" color="text.dark" p={1}>
                    In {chainPrettyName}, You can republish the module which
                    serve the purpose to migrate or upgrade the published module
                    by uploading new .mv file with similar configurations. Each
                    policy will provide different flexibility for further
                    upgrades whether you can add new functions without
                    maintaining old functions (Arbitrary), or required to
                    maintain old functions (Compatible). Choosing “Immutable”
                    will not allow you to make any changes with this module
                    ever. You should read more about
                  </Text>
                  <Flex
                    align="center"
                    cursor="pointer"
                    borderRadius={2}
                    p={1}
                    gap={1}
                    alignItems="center"
                    width="fit-content"
                    transition="all 0.25s ease-in-out"
                    color="secondary.main"
                    _hover={{
                      color: "secondary.light",
                      bgColor: "secondary.background",
                    }}
                    // onClick={onClick}
                  >
                    <Text variant="body2" color="primary.main" fontWeight={700}>
                      See Initia Doc
                    </Text>
                    <CustomIcon
                      name="chevron-right"
                      color="primary.main"
                      boxSize={3}
                      m={0}
                    />
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </Box>
        <Box w="10%" />
      </Box>
    </Box>
  );
};
