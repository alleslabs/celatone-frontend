import { Badge } from "@chakra-ui/react";

import type { Option } from "lib/types";

interface CountBadgeProps {
  count: Option<number>;
  variant: "common" | "execute" | "view";
}
export const CountBadge = ({ count, variant }: CountBadgeProps) => (
  <Badge
    p="2px 8px"
    bgColor={variant === "common" ? "gray.700" : "transparent"}
    border={variant === "common" ? "none" : "1px solid"}
    borderColor={variant === "view" ? "primary.main" : "secondary.dark"}
    textColor="text.main"
  >
    {count ?? "N/A"}
  </Badge>
);
