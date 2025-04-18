import type { IconKeys } from "lib/components/icon";
import type { Option, PublicDetail } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { trackSocial, trackWebsite } from "lib/amplitude";
import { CustomIconButton } from "lib/components/button";

export const renderSocial = (name: string): IconKeys => {
  switch (name) {
    case "x":
      return "x";
    case "telegram":
      return "telegram";
    case "discord":
      return "discord";
    default:
      return "info-circle";
  }
};

interface SocialMediaProps {
  details: Option<PublicDetail>;
}
export const SocialMedia = ({ details }: SocialMediaProps) => {
  if (!details) return null;
  return (
    <Flex
      alignItems="center"
      minHeight="32px"
      onClick={(e) => e.stopPropagation()}
    >
      {details.website && (
        <CustomIconButton
          href={details.website}
          icon="website"
          onClick={() => trackWebsite(details.website)}
        />
      )}
      {details.github && (
        <CustomIconButton
          href={details.github}
          icon="github"
          onClick={() => trackSocial(details.github)}
        />
      )}
      {details.socials.length &&
        details.socials.map(
          (social) =>
            social.url !== "" && (
              <CustomIconButton
                key={social.name}
                href={social.url}
                icon={renderSocial(social.name)}
                onClick={() => trackSocial(social.url)}
              />
            )
        )}
    </Flex>
  );
};
