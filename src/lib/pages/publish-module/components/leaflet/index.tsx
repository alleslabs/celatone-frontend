import type { GridItemProps } from "@chakra-ui/react";
import {
  Button,
  ModalFooter,
  Modal,
  ModalBody,
  useDisclosure,
  Text,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  Flex,
  Heading,
  chakra,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

import { metadata } from "./metadata";

const TitleContainer = chakra(Flex, {
  baseStyle: {
    bg: "gray.700",
    fontSize: "14px",
    color: "text.main",
    fontWeight: 600,
    p: 1,
    justifyContent: "center",
    alignItems: "center",
    wordBreak: "break-all",
    whiteSpace: "pre",
  },
});

const ContentContainer = (props: GridItemProps) => (
  <GridItem
    sx={{
      backgroundColor: "gray.900",
      color: "text.main",
      whiteSpace: "pre-wrap",
      p: "12px 16px",
      fontSize: "14px",
      height: "full",
    }}
    {...props}
  />
);

const GridTemplate = chakra(Grid, {
  baseStyle: {
    gridTemplateColumns: "140px repeat(3, 1fr)",
    columnGap: "2px",
    rowGap: "4px",
  },
});

const Header = () => (
  <>
    {metadata.header.map((header) => (
      <TitleContainer key={header}>{header}</TitleContainer>
    ))}
  </>
);

const columnMapper = (col: string[]) => (
  <Flex key={JSON.stringify(col)} direction="column" gap="2px">
    {col.map((row) => (
      <ContentContainer key={row} dangerouslySetInnerHTML={{ __html: row }} />
    ))}
  </Flex>
);

const StructContent = () => (
  <>
    <TitleContainer>fields</TitleContainer>
    {metadata.fields.map(columnMapper)}
  </>
);

const ExposedFnsContent = () => (
  <>
    <TitleContainer>visibility</TitleContainer>
    {metadata.visibility.map(columnMapper)}
    <TitleContainer>is_entry</TitleContainer>
    {metadata.is_entry.map(columnMapper)}
    <TitleContainer>parameter</TitleContainer>
    <ContentContainer colSpan={3}>{metadata.parameter}</ContentContainer>
    <TitleContainer>generic_type_{"\n"}params</TitleContainer>
    <GridItem
      colSpan={3}
      display="grid"
      gridTemplateColumns="repeat(3, minmax(0, 1fr))"
      gap="2px"
    >
      <ContentContainer colSpan={3}>
        {metadata.generic_type_params[0]}
      </ContentContainer>
      {metadata.generic_type_params[1].map((title) => (
        <TitleContainer key={title.toString()}>{title}</TitleContainer>
      ))}
      {(metadata.generic_type_params[2] as Array<string[]>).map(columnMapper)}
    </GridItem>
  </>
);
export const Leaflet = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Text
        ml={1}
        as="span"
        variant="body2"
        textColor="primary.main"
        fontWeight={600}
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        View conditions
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent
          maxH="90%"
          overflowY="scroll"
          sx={{ "& > *": { bg: "gray.800" } }}
        >
          <ModalHeader position="sticky" top={0}>
            <Flex align="center" gap={2}>
              <CustomIcon name="info-circle" boxSize={4} color="gray.600" />
              <Heading variant="h5" as="h5">
                Compatible Upgrade Policy
              </Heading>
            </Flex>
            <ModalCloseButton color="gray.600" />
          </ModalHeader>
          <ModalBody>
            <Heading variant="h6" as="h6">
              Structs
            </Heading>
            <Text variant="body2" my={3}>
              New structs can be added, but all old structs must remain a subset
              of republished module. New fields cannot be added within structs,
              but current fields can be removed. Example for struct fields are
              displayed below
            </Text>
            <GridTemplate>
              <Header />
              <StructContent />
            </GridTemplate>
            <Heading variant="h6" as="h6" mt={6}>
              Exposed Functions
            </Heading>
            <Text variant="body2" my={3}>
              New functions can be added, but all old functions must remain a
              subset of republished module. Example for exposed_functions
              properties changes are displayed below
            </Text>
            <GridTemplate>
              <Header />
              <ExposedFnsContent />
            </GridTemplate>
            <Heading variant="h6" as="h6" mt={6}>
              Friends
            </Heading>
            <Text variant="body2" my={3}>
              <Text as="span" mx={2}>
                &#x2022;
              </Text>
              New friends can be added, but must maintain all the current
              friends.
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center" position="sticky" bottom={0}>
            <Button variant="outline-white" onClick={onClose} w="240px">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
