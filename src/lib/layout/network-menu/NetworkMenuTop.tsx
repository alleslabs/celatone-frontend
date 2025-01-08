import { Box, Flex, Heading, Kbd, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { useAllowCustomNetworks, useIsMac, useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import InputWithIcon from "lib/components/InputWithIcon";

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
      <Flex width="100%" gap={4} direction="column">
        <Flex gap={1} direction="column">
          <Flex alignItems="center" gap={2}>
            <Heading as="h6" variant="h6">
              Select Network
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
              <Text as="span" variant="body3" color="text.dark">
                Want to add your network?
              </Text>{" "}
              <AppLink onClick={onClose} href="/custom-network/add">
                <Text
                  as="span"
                  variant="body3"
                  _hover={{ textDecoration: "underline" }}
                  color="primary.main"
                >
                  Add a custom chain.
                </Text>
              </AppLink>
            </Box>
          )}
        </Flex>
        <InputWithIcon
          size="md"
          value={keyword}
          amptrackSection="network-search"
          autoFocus={!isMobile}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleOnKeyDown}
          placeholder="Search by Name or Chain ID"
        />
      </Flex>
    );
  }
);
