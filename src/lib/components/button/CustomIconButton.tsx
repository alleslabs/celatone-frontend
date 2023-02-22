import { Button, Link } from "@chakra-ui/react";

import type { ICONS } from "../icon/CustomIcon";
import { CustomIcon } from "../icon/CustomIcon";

interface CustomIconButtonProps {
  href: string;
  icon?: keyof typeof ICONS;
  onClick?: () => void;
}

export const CustomIconButton = ({
  href,
  icon = "website",
  onClick,
}: CustomIconButtonProps) => {
  return (
    <Button
      variant="ghost"
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
        <CustomIcon name={icon} boxSize="5" />
      </Link>
    </Button>
  );
};
