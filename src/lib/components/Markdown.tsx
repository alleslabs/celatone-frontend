import type { PropsWithChildren } from "react";

import { Box, Heading, List, ListItem, Text } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const defaultTheme = {
  h1: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h1" fontSize={{ sm: "22px", md: "24px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  h2: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h2" fontSize={{ sm: "20px", md: "22px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  h3: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h3" fontSize={{ sm: "18px", md: "20px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  h4: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h4" fontSize={{ sm: "16px", md: "18px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  h5: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h5" fontSize={{ sm: "14px", md: "16px" }} mb={1}>
        {children}
      </Heading>
    );
  },
  h6: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h6" fontSize={{ sm: "12px", md: "14px" }} mb={1}>
        {children}
      </Heading>
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
  blockquote: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Box
        as="blockquote"
        background="gray.900"
        borderColor="gray.700"
        borderLeftWidth="4px"
        borderStyle="solid"
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
        whiteSpace="normal"
      >
        {children}
      </Box>
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
  li: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <ListItem fontSize="16px" mb={1} whiteSpace="normal">
        {children}
      </ListItem>
    );
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
  ol: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <List as="ol" mb={2} ml={4} styleType="decimal" whiteSpace="normal">
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
