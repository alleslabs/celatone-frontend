import { Button, Link } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

import { trackWebsite } from "lib/amplitude";
import { DEVELOPER_TOOL_DOCS_LINK, USER_GUIDE_DOCS_LINK } from "lib/data";

import { CustomIcon } from "./icon";

interface UserDocsButtonProps extends ButtonProps {
  title: string;
  href: string;
  isDevTool: boolean;
}

export const UserDocsButton = ({
  title,
  href,
  isDevTool,
  ...props
}: UserDocsButtonProps) => (
  <Link
    href={`${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`}
    onClick={(e) => {
      trackWebsite(
        `${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`
      );
      e.stopPropagation();
    }}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none" }}
  >
    <Button leftIcon={<CustomIcon name="document" boxSize={3} />} {...props}>
      {title}
    </Button>
  </Link>
);
