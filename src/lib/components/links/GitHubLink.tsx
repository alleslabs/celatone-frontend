import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { trackSocial } from "lib/amplitude";

interface GitHubLinkProps {
  github: string;
  hasMinW?: boolean;
}

export const GitHubLink = ({ github, hasMinW = false }: GitHubLinkProps) => {
  const [, , , org, repo] = github.split("/");
  return (
    <Flex gap={{ base: 0, md: 2 }} direction={{ base: "column", md: "row" }}>
      <Text
        minW={hasMinW ? 32 : "auto"}
        variant="body2"
        color="text.dark"
        fontWeight={500}
      >
        GitHub{!hasMinW && ":"}
      </Text>
      <a
        style={{ display: "flex" }}
        rel="noreferrer noopener"
        target="_blank"
        onClick={() => trackSocial(github)}
        href={github}
      >
        <Text variant="body2" color="primary.main" wordBreak="break-all">
          {org}/{repo}
        </Text>
        <CustomIcon
          marginLeft="8px"
          name="launch"
          boxSize="12px"
          color="gray.600"
        />
      </a>
    </Flex>
  );
};
