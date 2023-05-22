import { Button, Link } from "@chakra-ui/react";

import type { IconKeys } from "../icon";
import { CustomIcon } from "../icon";

interface CustomIconButtonProps {
  href: string;
  icon?: IconKeys;
  onClick?: () => void;
}

export const CustomIconButton = ({
  href,
  icon = "website",
  onClick,
}: CustomIconButtonProps) => (
  <Button
    variant="ghost-gray"
    size="xs"
    px="1"
    minWidth="32px"
    minHeight="32px"
    height="full"
  >
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      display="flex"
      alignItems="center"
      onClick={onClick}
    >
      <CustomIcon name={icon} boxSize="5" color="gray.600" />
    </Link>
  </Button>
);
