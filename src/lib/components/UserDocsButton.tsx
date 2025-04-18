import type { ButtonProps } from "@chakra-ui/react";

import { Button, Link } from "@chakra-ui/react";
import { trackWebsite } from "lib/amplitude";
import { DEVELOPER_TOOL_DOCS_LINK, USER_GUIDE_DOCS_LINK } from "lib/data";

import { CustomIcon } from "./icon";

interface UserDocsButtonProps extends ButtonProps {
  title: string;
  href: string;
  isDevTool: boolean;
}

export const UserDocsButton = ({
  href,
  isDevTool,
  title,
  ...props
}: UserDocsButtonProps) => (
  <Link
    style={{ textDecoration: "none" }}
    href={`${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`}
    rel="noopener noreferrer"
    target="_blank"
    onClick={(e) => {
      trackWebsite(
        `${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`
      );
      e.stopPropagation();
    }}
  >
    <Button leftIcon={<CustomIcon boxSize={3} name="document" />} {...props}>
      {title}
    </Button>
  </Link>
);
