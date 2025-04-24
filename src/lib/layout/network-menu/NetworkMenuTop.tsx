import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { Box, Flex, Heading, Kbd, Text } from "@chakra-ui/react";
import { useAllowCustomNetworks, useIsMac, useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import InputWithIcon from "lib/components/InputWithIcon";
import { observer } from "mobx-react-lite";

interface NetworkMenuTopProps {
  handleOnKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
  keyword: string;
  onClose: () => void;
  setKeyword: (value: string) => void;
}

export const NetworkMenuTop = observer(
  ({ handleOnKeyDown, keyword, onClose, setKeyword }: NetworkMenuTopProps) => {
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
                  <Text gap={1} variant="body3">
                    {isMac ? "⌘" : "Ctrl"}
                  </Text>
                </Kbd>
                <Kbd>
                  <Text gap={1} variant="body3">
                    /
                  </Text>
                </Kbd>
              </Flex>
            )}
          </Flex>
          {isAllowCustomNetworks && !isMobile && (
            <Box>
              <Text as="span" color="text.dark" variant="body3">
                Want to add your network?
              </Text>{" "}
              <AppLink href="/custom-network/add" onClick={onClose}>
                <Text
                  _hover={{ textDecoration: "underline" }}
                  as="span"
                  color="primary.main"
                  variant="body3"
                >
                  Add a custom chain.
                </Text>
              </AppLink>
            </Box>
          )}
        </Flex>
        <InputWithIcon
          amptrackSection="network-search"
          autoFocus={!isMobile}
          placeholder="Search by name or chain ID"
          size="md"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleOnKeyDown}
        />
      </Flex>
    );
  }
);
