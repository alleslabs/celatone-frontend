import { Flex, Text } from "@chakra-ui/react";
import { trackSocial } from "lib/amplitude";

import { CustomIcon } from "../icon";

interface GitHubLinkProps {
  github: string;
  hasMinW?: boolean;
}

export const GitHubLink = ({ github, hasMinW = false }: GitHubLinkProps) => {
  const [, , , org, repo] = github.split("/");
  return (
    <Flex direction={{ base: "column", md: "row" }} gap={{ base: 0, md: 2 }}>
      <Text
        color="text.dark"
        fontWeight={500}
        minW={hasMinW ? 32 : "auto"}
        variant="body2"
      >
        GitHub{!hasMinW && ":"}
      </Text>
      <a
        style={{ display: "flex" }}
        href={github}
        rel="noreferrer noopener"
        target="_blank"
        onClick={() => trackSocial(github)}
      >
        <Text color="primary.main" variant="body2" wordBreak="break-all">
          {org}/{repo}
        </Text>
        <CustomIcon
          boxSize="12px"
          color="gray.600"
          marginLeft="8px"
          name="launch"
        />
      </a>
    </Flex>
  );
};
