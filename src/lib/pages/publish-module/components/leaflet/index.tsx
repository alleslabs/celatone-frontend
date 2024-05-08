import type { GridItemProps } from "@chakra-ui/react";
import {
  Button,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";

import { metadata } from "./metadata";

const TitleContainer = (props: GridItemProps) => (
  <GridItem
    display="flex"
    bg="gray.700"
    fontSize="14px"
    color="text.main"
    fontWeight={600}
    p={1}
    justifyContent="center"
    wordBreak="break-all"
    whiteSpace="pre"
    alignItems="center"
    {...props}
  />
);

const ContentContainer = (props: GridItemProps) => (
  <GridItem
    display="flex"
    bgColor="gray.900"
    color="text.main"
    whiteSpace="pre-wrap"
    p="12px 16px"
    fontSize="14px"
    h="full"
    {...props}
  />
);

const GridTemplate = chakra(Grid, {
  baseStyle: {
    gridTemplateColumns: "140px repeat(3, 1fr)",
    columnGap: "2px",
    rowGap: "2px",
  },
});

const Header = () => (
  <GridTemplate>
    {metadata.header.map((header) => (
      <TitleContainer key={header}>{header}</TitleContainer>
    ))}
  </GridTemplate>
);

const rowMapper = (row: string[]) =>
  row.map((each, idx) => (
    <ContentContainer
      key={each + idx.toString()}
      dangerouslySetInnerHTML={{ __html: each }}
    />
  ));

const centerRowMapper = (row: string[]) =>
  row.map((each, idx) => (
    <ContentContainer
      key={each + idx.toString()}
      dangerouslySetInnerHTML={{ __html: each }}
      alignItems="center"
    />
  ));

const StructContent = () => (
  <GridTemplate mt="2px">
    <TitleContainer rowSpan={2}>fields</TitleContainer>
    <ContentContainer
      rowSpan={2}
      dangerouslySetInnerHTML={{ __html: metadata.fields[0][0] }}
    />
    {metadata.fields.slice(1).map(rowMapper)}
  </GridTemplate>
);

const ExposedFnsContent = () => (
  <Flex direction="column" rowGap="2px" mt="2px">
    <GridTemplate>
      <TitleContainer rowSpan={3}>visibility</TitleContainer>
      {metadata.visibility.map(centerRowMapper)}
    </GridTemplate>
    <GridTemplate>
      <TitleContainer rowSpan={2}>is_entry</TitleContainer>
      {metadata.is_entry.map(centerRowMapper)}
    </GridTemplate>
    <GridTemplate>
      <TitleContainer>parameter</TitleContainer>
      <ContentContainer colSpan={3}>{metadata.parameter}</ContentContainer>
    </GridTemplate>
    <GridTemplate>
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
        <ContentContainer
          rowSpan={2}
          dangerouslySetInnerHTML={{
            __html: metadata.generic_type_params[2][0][0],
          }}
        />
        {(metadata.generic_type_params[2].slice(1) as Array<string[]>).map(
          rowMapper
        )}
      </GridItem>
    </GridTemplate>
  </Flex>
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
          track(AmpEvent.USE_VIEW_CONDITION);
          e.stopPropagation();
          onOpen();
        }}
      >
        View conditions
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent
          maxH="80%"
          overflowY="scroll"
          sx={{ "& > *": { bg: "gray.800" } }}
        >
          <ModalHeader position="sticky" top={0} gap={2}>
            <CustomIcon
              name="info-circle"
              boxSize={4}
              color="gray.600"
              alignSelf="center"
            />
            <Heading variant="h5" as="h5">
              Compatible Upgrade Policy
            </Heading>
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
            <Header />
            <StructContent />
            <Heading variant="h6" as="h6" mt={6}>
              Exposed Functions
            </Heading>
            <Text variant="body2" my={3}>
              New functions can be added, but all old functions must remain a
              subset of republished module. Example for exposed_functions
              properties changes are displayed below
            </Text>
            {/* Exposed Functions Table Content */}
            <Header />
            <ExposedFnsContent />
            {/*  */}
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
