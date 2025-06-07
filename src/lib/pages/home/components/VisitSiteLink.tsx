import { Button } from "@chakra-ui/react";
import { trackWebsite } from "lib/amplitude";
import { useCelatoneApp, useInitiaL1 } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { INITIA_WEBSITE_URL } from "lib/data";
import { useChainProfile } from "lib/services/chain-config";
import Link from "next/link";

export const VisitSiteLink = () => {
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });
  const {
    chainConfig: { prettyName },
  } = useCelatoneApp();
  const { data: chainProfile } = useChainProfile();

  const website = isInitiaL1
    ? INITIA_WEBSITE_URL
    : chainProfile?.[prettyName]?.social?.website;

  if (!website) return <UserDocsLink href="introduction/overview" isButton />;

  return (
    <Link
      href={website}
      rel="noopener noreferrer"
      target="_blank"
      onClick={(e) => {
        trackWebsite(website);
        e.stopPropagation();
      }}
    >
      <Button
        leftIcon={<CustomIcon boxSize={3} name="website" />}
        size="sm"
        variant="ghost-primary"
      >
        Visit {prettyName}
      </Button>
    </Link>
  );
};
