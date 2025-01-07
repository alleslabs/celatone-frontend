import { Flex } from "@chakra-ui/react";

import { trackSocial, trackWebsite } from "lib/amplitude";
import { CustomIconButton } from "lib/components/button";
import type { IconKeys } from "lib/components/icon";
import type { Option, PublicDetail } from "lib/types";

export const renderSocial = (name: string): IconKeys => {
  switch (name) {
    case "discord":
      return "discord";
    case "telegram":
      return "telegram";
    case "twitter":
      return "twitter";
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
          icon="website"
          onClick={() => trackWebsite(details.website)}
          href={details.website}
        />
      )}
      {details.github && (
        <CustomIconButton
          icon="github"
          onClick={() => trackSocial(details.github)}
          href={details.github}
        />
      )}
      {details.socials.length &&
        details.socials.map(
          (social) =>
            social.url !== "" && (
              <CustomIconButton
                key={social.name}
                icon={renderSocial(social.name)}
                onClick={() => trackSocial(social.url)}
                href={social.url}
              />
            )
        )}
    </Flex>
  );
};
