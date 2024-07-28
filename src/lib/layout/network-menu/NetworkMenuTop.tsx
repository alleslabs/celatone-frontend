import { Flex, Heading, Kbd, Text } from "@chakra-ui/react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { useIsMac, useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";

interface NetworkMenuTopProps {
  keyword: string;
  setKeyword: (value: string) => void;
  handleOnKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
}

export const NetworkMenuTop = ({
  keyword,
  setKeyword,
  handleOnKeyDown,
}: NetworkMenuTopProps) => {
  const isMobile = useMobile();
  const isMac = useIsMac();

  return (
    <Flex direction="column" gap={4} width="100%">
      <Flex direction="column" gap={1}>
        <Flex alignItems="center" gap={2}>
          <Heading as="h6" variant="h6">
            Select Network
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
      </Flex>
      <InputWithIcon
        placeholder="Search by Name or Chain ID"
        size="md"
        value={keyword}
        autoFocus={!isMobile}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleOnKeyDown}
        amptrackSection="network-search"
      />
    </Flex>
  );
};
