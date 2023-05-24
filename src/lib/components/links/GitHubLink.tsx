import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { AmpTrackSocial } from "lib/services/amplitude";

interface GitHubLinkProps {
  github: string;
}

export const GitHubLink = ({ github }: GitHubLinkProps) => {
  const [, , , org, repo] = github.split("/");
  return (
    <Flex gap={2}>
      <Text fontWeight={500} color="text.dark" variant="body2">
        GitHub:
      </Text>
      <a
        href={github}
        onClick={() => AmpTrackSocial(github)}
        target="_blank"
        rel="noreferrer noopener"
        style={{ display: "flex" }}
      >
        <Text color="secondary.main" variant="body2" wordBreak="break-all">
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
