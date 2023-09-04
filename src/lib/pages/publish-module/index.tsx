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
} from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";

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
                    variant="body1"
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
                  Your .mv files should consist of module name, available
                  functions and their properties, module mechanics, friends.
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
                    variant="body1"
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
                  In {chainPrettyName}, You can republish the module which serve
                  the purpose to migrate or upgrade the published module by
                  uploading new .mv file with similar configurations. Each
                  policy will provide different flexibility for further upgrades
                  whether you can add new functions without maintaining old
                  functions (Arbitrary), or required to maintain old functions
                  (Compatible). Choosing “Immutable” will not allow you to make
                  any changes with this module ever. You should read more about
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
