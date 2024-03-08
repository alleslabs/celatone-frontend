import { Button, type ButtonProps } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const WebsiteButton = (props: ButtonProps) => (
  <Button
    leftIcon={<CustomIcon name="website" boxSize={3} />}
    rightIcon={<CustomIcon name="launch" boxSize={3} />}
    size="sm"
    variant="outline-primary"
    {...props}
  >
    Website
  </Button>
);
