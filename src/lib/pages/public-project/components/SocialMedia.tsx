import { Flex } from "@chakra-ui/react";

import { useTrack } from "lib/amplitude";
import { CustomIconButton } from "lib/components/button";
import type { IconKeys } from "lib/components/icon";
import type { Option, PublicDetail } from "lib/types";

export const renderSocial = (name: string): IconKeys => {
  switch (name) {
    case "twitter":
      return "twitter";
    case "telegram":
      return "telegram";
    case "discord":
      return "discord";
    default:
      return "info-circle-solid";
  }
};

interface SocialMediaProps {
  details: Option<PublicDetail>;
}
export const SocialMedia = ({ details }: SocialMediaProps) => {
  const { trackWebsite, trackSocial } = useTrack();

  if (!details) return null;
  return (
    <Flex
      alignItems="center"
      onClick={(e) => e.stopPropagation()}
      minHeight="32px"
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
