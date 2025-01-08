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
    alignItems="center"
    bg="gray.700"
    display="flex"
    p={1}
    whiteSpace="pre"
    color="text.main"
    fontSize="14px"
    fontWeight={600}
    justifyContent="center"
    wordBreak="break-all"
    {...props}
  />
);

const ContentContainer = (props: GridItemProps) => (
  <GridItem
    display="flex"
    h="full"
    p="12px 16px"
    whiteSpace="pre-wrap"
    bgColor="gray.900"
    color="text.main"
    fontSize="14px"
    {...props}
  />
);

const GridTemplate = chakra(Grid, {
  baseStyle: {
    columnGap: "2px",
    gridTemplateColumns: "140px repeat(3, 1fr)",
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
      alignItems="center"
      dangerouslySetInnerHTML={{ __html: each }}
    />
  ));

const StructContent = () => (
  <GridTemplate mt="2px">
    <TitleContainer rowSpan={2}>fields</TitleContainer>
    <ContentContainer
      dangerouslySetInnerHTML={{ __html: metadata.fields[0][0] }}
      rowSpan={2}
    />
    {metadata.fields.slice(1).map(rowMapper)}
  </GridTemplate>
);

const ExposedFnsContent = () => (
  <Flex mt="2px" direction="column" rowGap="2px">
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
        gridTemplateColumns="repeat(3, minmax(0, 1fr))"
        display="grid"
        gap="2px"
        colSpan={3}
      >
        <ContentContainer colSpan={3}>
          {metadata.generic_type_params[0]}
        </ContentContainer>
        {metadata.generic_type_params[1].map((title) => (
          <TitleContainer key={title.toString()}>{title}</TitleContainer>
        ))}
        <ContentContainer
          dangerouslySetInnerHTML={{
            __html: metadata.generic_type_params[2][0][0],
          }}
          rowSpan={2}
        />
        {(metadata.generic_type_params[2].slice(1) as Array<string[]>).map(
          rowMapper
        )}
      </GridItem>
    </GridTemplate>
  </Flex>
);
export const Leaflet = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Text
        as="span"
        ml={1}
        variant="body2"
        _hover={{ textDecoration: "underline" }}
        cursor="pointer"
        fontWeight={600}
        onClick={(e) => {
          track(AmpEvent.USE_VIEW_CONDITION);
          e.stopPropagation();
          onOpen();
        }}
        textColor="primary.main"
      >
        View conditions
      </Text>
      <Modal isOpen={isOpen} size="6xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxH="80%"
          sx={{ "& > *": { bg: "gray.800" } }}
          overflowY="scroll"
        >
          <ModalHeader gap={2} position="sticky" top={0}>
            <CustomIcon
              alignSelf="center"
              name="info-circle"
              boxSize={4}
              color="gray.600"
            />
            <Heading as="h5" variant="h5">
              Compatible Upgrade Policy
            </Heading>
            <ModalCloseButton color="gray.600" />
          </ModalHeader>
          <ModalBody>
            <Heading as="h6" variant="h6">
              Structs
            </Heading>
            <Text my={3} variant="body2">
              New structs can be added, but all old structs must remain a subset
              of republished module. New fields cannot be added within structs,
              but current fields can be removed. Example for struct fields are
              displayed below
            </Text>
            <Header />
            <StructContent />
            <Heading as="h6" mt={6} variant="h6">
              Exposed Functions
            </Heading>
            <Text my={3} variant="body2">
              New functions can be added, but all old functions must remain a
              subset of republished module. Example for exposed_functions
              properties changes are displayed below
            </Text>
            {/* Exposed Functions Table Content */}
            <Header />
            <ExposedFnsContent />
            {/*  */}
            <Heading as="h6" mt={6} variant="h6">
              Friends
            </Heading>
            <Text my={3} variant="body2">
              <Text as="span" mx={2}>
                &#x2022;
              </Text>
              New friends can be added, but must maintain all the current
              friends.
            </Text>
          </ModalBody>
          <ModalFooter bottom={0} justifyContent="center" position="sticky">
            <Button variant="outline-white" w="240px" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
