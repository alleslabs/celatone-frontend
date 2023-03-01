import { Button, Icon, Link } from "@chakra-ui/react";
import type { IconType } from "react-icons/lib";
import { MdLanguage } from "react-icons/md";

interface IconButtonProps {
  href: string;
  icon: IconType;
  onClick?: () => void;
}

const iconHover = "pebble.500";

export const IconButton = ({ href, icon, onClick }: IconButtonProps) => (
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
      <Icon
        as={icon}
        color="pebble.600"
        _hover={{ color: iconHover }}
        transition="all .25s ease-in-out"
        boxSize={icon === MdLanguage ? "6" : "5"}
      />
    </Link>
  </Button>
);
