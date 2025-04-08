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
    height="full"
    minHeight="32px"
    minWidth="32px"
    px={1}
    size="xs"
    variant="ghost-gray"
  >
    <Link
      alignItems="center"
      display="flex"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      onClick={onClick}
    >
      <CustomIcon boxSize={5} color="gray.600" name={icon} />
    </Link>
  </Button>
);
