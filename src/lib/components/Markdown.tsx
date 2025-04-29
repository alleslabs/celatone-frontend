import type { PropsWithChildren } from "react";

import {
  Box,
  Heading,
  List,
  ListItem,
  Table,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { TableContainer } from "./table";

const defaultTheme = {
  blockquote: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Box
        as="blockquote"
        background="gray.900"
        borderColor="gray.700"
        borderLeftWidth="4px"
        my={4}
        px={4}
        py={2}
        sx={{ "> p": { marginBottom: 0 } }}
        whiteSpace="normal"
      >
        {children}
      </Box>
    );
  },
  code: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Box
        as="code"
        background="gray.900"
        borderRadius="4px"
        display="inline-block"
        mx={1}
        px={2}
        py={1}
        sx={{ "> p": { marginBottom: 0 } }}
      >
        {children}
      </Box>
    );
  },
  h1: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h1" fontSize={{ md: "24px", sm: "22px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  h2: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h2" fontSize={{ md: "22px", sm: "20px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  h3: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h3" fontSize={{ md: "20px", sm: "18px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  h4: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h4" fontSize={{ md: "18px", sm: "16px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  h5: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h5" fontSize={{ md: "16px", sm: "14px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  h6: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h6" fontSize={{ md: "14px", sm: "12px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  li: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <ListItem fontSize="16px" mb={1} whiteSpace="normal">
        {children}
      </ListItem>
    );
  },
  ol: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <List as="ol" mb={2} ml={4} styleType="decimal" whiteSpace="normal">
        {children}
      </List>
    );
  },
  p: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Text color="text.main" mb={1} variant="body2">
        {children}
      </Text>
    );
  },
  pre: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Box
        as="pre"
        background="gray.900"
        borderRadius="4px"
        p={4}
        sx={{ "> p": { marginBottom: 0 } }}
        whiteSpace="normal"
      >
        {children}
      </Box>
    );
  },
  table: (props: PropsWithChildren) => {
    const { children } = props;

    return (
      <TableContainer
        sx={{
          "@media screen and (min-width: 767px)": {
            width: "100%",
          },
          width: "87vw",
        }}
      >
        <Table
          style={{ tableLayout: "auto" }}
          minW="max-content"
          variant="simple"
        >
          {children}
        </Table>
      </TableContainer>
    );
  },
  td: (props: PropsWithChildren) => {
    const { children } = props;
    return <Td px={3}>{children}</Td>;
  },
  th: (props: PropsWithChildren) => {
    const { children } = props;
    return <Th px={3}>{children}</Th>;
  },
  thead: (props: PropsWithChildren) => {
    const { children } = props;
    return <Thead>{children}</Thead>;
  },
  tr: (props: PropsWithChildren) => {
    const { children } = props;
    return <Tr>{children}</Tr>;
  },
  ul: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <List
        mb={2}
        ml={4}
        styleType="disc"
        sx={{ "li::marker": { color: "primary.light" } }}
        whiteSpace="normal"
      >
        {children}
      </List>
    );
  },
};

export const Markdown = ({ markdown }: { markdown: string }) => {
  return (
    <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      <ReactMarkdown
        components={ChakraUIRenderer(defaultTheme)}
        remarkPlugins={[remarkGfm]}
        skipHtml
      >
        {markdown.replace(/\\n/g, "\n")}
      </ReactMarkdown>
    </div>
  );
};
