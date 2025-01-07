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
    minWidth="32px"
    height="full"
    minHeight="32px"
    px={1}
    size="xs"
    variant="ghost-gray"
  >
    <Link
      alignItems="center"
      display="flex"
      rel="noopener noreferrer"
      target="_blank"
      onClick={onClick}
      href={href}
    >
      <CustomIcon name={icon} boxSize={5} color="gray.600" />
    </Link>
  </Button>
);
