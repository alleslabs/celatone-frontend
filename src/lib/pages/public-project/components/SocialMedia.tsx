import { Flex, Link, Icon } from "@chakra-ui/react";
import {
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaDiscord,
  FaInfo,
} from "react-icons/fa";
import { MdLanguage } from "react-icons/md";

import type { Option, Detail } from "lib/types";

const iconHover = "pebble.500";

export const renderSocial = (name: string) => {
  switch (name) {
    case "twitter":
      return FaTwitter;
    case "telegram":
      return FaTelegram;
    case "discord":
      return FaDiscord;
    default:
      return FaInfo;
  }
};

interface SocialMediaProps {
  details: Option<Detail>;
}
export const SocialMedia = ({ details }: SocialMediaProps) => {
  if (!details) return null;
  return (
    <Flex
      alignItems="center"
      gap="2"
      mt={2}
      onClick={(e) => e.stopPropagation()}
    >
      {details.website && (
        // todos: create ExternalLink component later
        <Link href={details.website} target="_blank" rel="noopener noreferrer">
          <Icon
            as={MdLanguage}
            color="pebble.600"
            _hover={{ color: iconHover }}
            transition="all 0.2s"
            boxSize="6"
          />
        </Link>
      )}
      {details.github && (
        // todos: create ExternalLink component later
        <Link href={details.github} target="_blank" rel="noopener noreferrer">
          <Icon
            as={FaGithub}
            color="pebble.600"
            _hover={{ color: iconHover }}
            transition="all 0.2s"
            boxSize="5"
          />
        </Link>
      )}
      {details.socials.length &&
        details.socials.map(
          (social) =>
            social.url !== "" && (
              // todos: create ExternalLink component later
              <Link
                href={social.url}
                target="_blank"
                key={social.name}
                rel="noopener noreferrer"
              >
                <Icon
                  as={renderSocial(social.name)}
                  color="pebble.600"
                  _hover={{ color: iconHover }}
                  transition="all 0.2s"
                  boxSize="5"
                />
              </Link>
            )
        )}
    </Flex>
  );
};
