import { Button, Icon, Link } from "@chakra-ui/react";
import type { IconType } from "react-icons/lib";

import type { ICONS } from "../icon/CustomIcon";
import { CustomIcon } from "../icon/CustomIcon";

interface CustomIconButtonProps {
  href: string;
  socialIcon?: IconType;
  icon?: keyof typeof ICONS;
  onClick?: () => void;
}

export const CustomIconButton = ({
  href,
  icon = "website",
  socialIcon,
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
        {socialIcon ? (
          <Icon
            as={socialIcon}
            color="pebble.600"
            transition="all .25s ease-in-out"
            boxSize="5"
          />
        ) : (
          <CustomIcon name={icon} boxSize="5" />
        )}
      </Link>
    </Button>
  );
};
