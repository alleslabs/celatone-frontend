import { Box, Heading, List, ListItem, Text } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import type { PropsWithChildren } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const defaultTheme = {
  h1: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading mb={1} as="h1" fontSize={{ sm: "22px", md: "24px" }}>
        {children}
      </Heading>
    );
  },
  h2: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading mb={1} as="h2" fontSize={{ sm: "20px", md: "22px" }}>
        {children}
      </Heading>
    );
  },
  h3: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading mb={1} as="h3" fontSize={{ sm: "18px", md: "20px" }}>
        {children}
      </Heading>
    );
  },
  h4: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading mb={1} as="h4" fontSize={{ sm: "16px", md: "18px" }}>
        {children}
      </Heading>
    );
  },
  h5: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading mb={1} as="h5" fontSize={{ sm: "14px", md: "16px" }}>
        {children}
      </Heading>
    );
  },
  h6: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Heading mb={1} as="h6" fontSize={{ sm: "12px", md: "14px" }}>
        {children}
      </Heading>
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
  blockquote: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <Box
        as="blockquote"
        background="gray.900"
        borderLeft="4px solid"
        borderColor="gray.700"
        px={4}
        py={2}
        my={4}
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
        display="inline-block"
        background="gray.900"
        px={2}
        py={1}
        mx={1}
        borderRadius="4px"
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
        p={4}
        borderRadius="4px"
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
      <ListItem mb={1} fontSize="16px" whiteSpace="normal">
        {children}
      </ListItem>
    );
  },
  ul: (props: PropsWithChildren) => {
    const { children } = props;
    return (
      <List
        styleType="disc"
        ml={4}
        mb={2}
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
      <List as="ol" styleType="decimal" ml={4} mb={2} whiteSpace="normal">
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
        skipHtml
        remarkPlugins={[remarkGfm]}
      >
        {markdown.replace(/\\n/g, "\n")}
      </ReactMarkdown>
    </div>
  );
};
