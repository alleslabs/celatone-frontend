import { Box, Flex, Heading, Kbd, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { useAllowCustomNetworks, useIsMac, useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import InputWithIcon from "lib/components/InputWithIcon";

interface NetworkMenuTopProps {
  keyword: string;
  setKeyword: (value: string) => void;
  handleOnKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
  onClose: () => void;
}

export const NetworkMenuTop = observer(
  ({ keyword, setKeyword, handleOnKeyDown, onClose }: NetworkMenuTopProps) => {
    const isMobile = useMobile();
    const isMac = useIsMac();
    const isAllowCustomNetworks = useAllowCustomNetworks({
      shouldRedirect: false,
    });

    return (
      <Flex direction="column" gap={4} width="100%">
        <Flex direction="column" gap={1}>
          <Flex alignItems="center" gap={2}>
            <Heading as="h6" variant="h6">
              Select network
            </Heading>
            {!isMobile && (
              <Flex gap={1}>
                <Kbd size="sm">
                  <Text variant="body3" gap={1}>
                    {isMac ? "⌘" : "Ctrl"}
                  </Text>
                </Kbd>
                <Kbd>
                  <Text variant="body3" gap={1}>
                    /
                  </Text>
                </Kbd>
              </Flex>
            )}
          </Flex>
          {isAllowCustomNetworks && !isMobile && (
            <Box>
              <Text as="span" variant="body3" color="text.dark">
                Want to add your network?
              </Text>{" "}
              <AppLink href="/custom-network/add" onClick={onClose}>
                <Text
                  as="span"
                  variant="body3"
                  color="primary.main"
                  _hover={{ textDecoration: "underline" }}
                >
                  Add a custom chain.
                </Text>
              </AppLink>
            </Box>
          )}
        </Flex>
        <InputWithIcon
          placeholder="Search by name or chain ID"
          size="md"
          value={keyword}
          autoFocus={!isMobile}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleOnKeyDown}
          amptrackSection="network-search"
        />
      </Flex>
    );
  }
);
