import type { ButtonProps } from "@chakra-ui/react";

import { Button, Link } from "@chakra-ui/react";
import { trackWebsite } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

interface WebsiteButtonProps extends ButtonProps {
  href: string;
}

const RenderWebsiteButton = ({ href, ...props }: WebsiteButtonProps) => (
  <Button
    isDisabled={!href}
    leftIcon={<CustomIcon boxSize={3} name="website" />}
    rightIcon={<CustomIcon boxSize={3} name="launch" />}
    size="sm"
    variant="outline-primary"
    width={{ base: "full", md: "auto" }}
    onClick={() => trackWebsite(href)}
    {...props}
  >
    Website
  </Button>
);

export const WebsiteButton = ({ href, ...props }: WebsiteButtonProps) =>
  href ? (
    <Link _hover={{ textDecoration: "none" }} href={href} isExternal>
      <RenderWebsiteButton href={href} {...props} />
    </Link>
  ) : (
    <Tooltip label="No website was provided">
      <RenderWebsiteButton href={href} {...props} />
    </Tooltip>
  );
