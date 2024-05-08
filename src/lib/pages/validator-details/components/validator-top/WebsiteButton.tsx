import { Button, Link } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

import { trackWebsite } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

interface WebsiteButtonProps extends ButtonProps {
  href: string;
}

const RenderWebsiteButton = ({ href, ...props }: WebsiteButtonProps) => (
  <Button
    leftIcon={<CustomIcon name="website" boxSize={3} />}
    rightIcon={<CustomIcon name="launch" boxSize={3} />}
    size="sm"
    variant="outline-primary"
    width={{ base: "full", md: "auto" }}
    isDisabled={!href}
    onClick={() => trackWebsite(href)}
    {...props}
  >
    Website
  </Button>
);

export const WebsiteButton = ({ href, ...props }: WebsiteButtonProps) =>
  href ? (
    <Link href={href} isExternal _hover={{ textDecoration: "none" }}>
      <RenderWebsiteButton href={href} {...props} />
    </Link>
  ) : (
    <Tooltip label="No website was provided">
      <RenderWebsiteButton href={href} {...props} />
    </Tooltip>
  );
