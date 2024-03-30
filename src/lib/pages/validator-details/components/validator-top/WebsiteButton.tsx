import { Button, Link } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface WebsiteButtonProps extends ButtonProps {
  href: string;
}

export const WebsiteButton = ({ href, ...props }: WebsiteButtonProps) =>
  href && (
    <Link href={href} isExternal _hover={{ textDecoration: "none" }}>
      <Button
        leftIcon={<CustomIcon name="website" boxSize={3} />}
        rightIcon={<CustomIcon name="launch" boxSize={3} />}
        size="sm"
        variant="outline-primary"
        width={{ base: "full", md: "auto" }}
        {...props}
      >
        Website
      </Button>
    </Link>
  );
