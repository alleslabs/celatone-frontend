import { Button, Link } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

import { trackWebsite } from "lib/amplitude";
import { DEVELOPER_TOOL_DOCS_LINK, USER_GUIDE_DOCS_LINK } from "lib/data";

import { CustomIcon } from "./icon";

interface UserDocsButtonProps extends ButtonProps {
  href: string;
  isDevTool: boolean;
  title: string;
}

export const UserDocsButton = ({
  href,
  isDevTool,
  title,
  ...props
}: UserDocsButtonProps) => (
  <Link
    style={{ textDecoration: "none" }}
    rel="noopener noreferrer"
    target="_blank"
    onClick={(e) => {
      trackWebsite(
        `${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`
      );
      e.stopPropagation();
    }}
    href={`${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`}
  >
    <Button leftIcon={<CustomIcon name="document" boxSize={3} />} {...props}>
      {title}
    </Button>
  </Link>
);
