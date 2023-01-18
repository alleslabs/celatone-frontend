import { Flex, Link, Icon } from "@chakra-ui/react";
import {
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaDiscord,
  FaInfo,
} from "react-icons/fa";
import { MdLanguage } from "react-icons/md";

import type { Option } from "lib/types";
import type { Detail } from "lib/types/projects";

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

interface SocialProps {
  details: Option<Detail>;
}
export const SocialMedia = ({ details }: SocialProps) => {
  return (
    <Flex
      alignItems="center"
      gap="2"
      mt={2}
      onClick={(e) => e.stopPropagation()}
    >
      {details?.website && (
        <Link href={details?.website} target="_blank">
          <Icon
            as={MdLanguage}
            color="gray.600"
            _hover={{ color: "gray.500" }}
            transition="all 0.2s"
            boxSize="6"
          />
        </Link>
      )}
      {details?.github && (
        <Link href={details?.github} target="_blank">
          <Icon
            as={FaGithub}
            color="gray.600"
            _hover={{ color: "gray.500" }}
            transition="all 0.2s"
            boxSize="5"
          />
        </Link>
      )}
      {details?.socials.length &&
        details?.socials.map(
          (social) =>
            social.url !== "" && (
              <Link href={social.url} target="_blank" key={social.name}>
                <Icon
                  as={renderSocial(social.name)}
                  color="gray.600"
                  _hover={{ color: "gray.500" }}
                  transition="all 0.2s"
                  boxSize="5"
                />
              </Link>
            )
        )}
    </Flex>
  );
};
