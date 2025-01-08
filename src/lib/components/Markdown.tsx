import { Box, Heading, List, ListItem, Text } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import type { PropsWithChildren } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const defaultTheme = {
  blockquote: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Box
        as="blockquote"
        my={4}
        px={4}
        py={2}
        sx={{ "> p": { marginBottom: 0 } }}
        whiteSpace="normal"
        background="gray.900"
        borderColor="gray.700"
        borderLeft="4px solid"
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
        display="inline-block"
        mx={1}
        px={2}
        py={1}
        sx={{ "> p": { marginBottom: 0 } }}
        whiteSpace="normal"
        background="gray.900"
        borderRadius="4px"
      >
        {children}
      </Box>
    );
  },
  h1: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h1" mb={1} fontSize={{ md: "24px", sm: "22px" }}>
        {children}
      </Heading>
    );
  },
  h2: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h2" mb={1} fontSize={{ md: "22px", sm: "20px" }}>
        {children}
      </Heading>
    );
  },
  h3: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h3" mb={1} fontSize={{ md: "20px", sm: "18px" }}>
        {children}
      </Heading>
    );
  },
  h4: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h4" mb={1} fontSize={{ md: "18px", sm: "16px" }}>
        {children}
      </Heading>
    );
  },
  h5: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h5" mb={1} fontSize={{ md: "16px", sm: "14px" }}>
        {children}
      </Heading>
    );
  },
  h6: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading as="h6" mb={1} fontSize={{ md: "14px", sm: "12px" }}>
        {children}
      </Heading>
    );
  },
  li: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <ListItem mb={1} whiteSpace="normal" fontSize="16px">
        {children}
      </ListItem>
    );
  },
  ol: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <List styleType="decimal" as="ol" mb={2} ml={4} whiteSpace="normal">
        {children}
      </List>
    );
  },
  p: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Text mb={1} variant="body2" color="text.main">
        {children}
      </Text>
    );
  },
  pre: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Box
        as="pre"
        p={4}
        sx={{ "> p": { marginBottom: 0 } }}
        whiteSpace="normal"
        background="gray.900"
        borderRadius="4px"
      >
        {children}
      </Box>
    );
  },
  ul: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <List
        styleType="disc"
        mb={2}
        ml={4}
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
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={ChakraUIRenderer(defaultTheme)}
      >
        {markdown.replace(/\\n/g, "\n")}
      </ReactMarkdown>
    </div>
  );
};
