import { Flex } from "@chakra-ui/react";

import { CustomIconButton } from "lib/components/button/CustomIconButton";
import type { ICONS } from "lib/components/icon/CustomIcon";
import { AmpTrackSocial, AmpTrackWebsite } from "lib/services/amplitude";
import type { Option, PublicDetail } from "lib/types";

export const renderSocial = (name: string) => {
  switch (name) {
    case "twitter":
      return "twitter" as keyof typeof ICONS;
    case "telegram":
      return "telegram" as keyof typeof ICONS;
    case "discord":
      return "discord" as keyof typeof ICONS;
    default:
      return "infoCircle";
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
      onClick={(e) => e.stopPropagation()}
      minHeight="32px"
    >
      {details.website && (
        <CustomIconButton
          href={details.website}
          icon="website"
          onClick={() => AmpTrackWebsite(details.website)}
        />
      )}
      {details.github && (
        <CustomIconButton href={details.github} icon="github" />
      )}
      {details.socials.length &&
        details.socials.map(
          (social) =>
            social.url !== "" && (
              <CustomIconButton
                key={social.name}
                href={social.url}
                icon={renderSocial(social.name)}
                onClick={() => AmpTrackSocial(social.url)}
              />
            )
        )}
    </Flex>
  );
};
