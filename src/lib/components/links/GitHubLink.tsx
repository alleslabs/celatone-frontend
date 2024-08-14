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
        fontWeight={500}
        color="text.dark"
        variant="body2"
        minW={hasMinW ? 32 : "auto"}
      >
        GitHub{!hasMinW && ":"}
      </Text>
      <a
        href={github}
        onClick={() => trackSocial(github)}
        target="_blank"
        rel="noreferrer noopener"
        style={{ display: "flex" }}
      >
        <Text color="primary.main" variant="body2" wordBreak="break-all">
          {org}/{repo}
        </Text>
        <CustomIcon
          name="launch"
          boxSize="12px"
          marginLeft="8px"
          color="gray.600"
        />
      </a>
    </Flex>
  );
};
