import { Badge } from "@chakra-ui/react";

import type { Option } from "lib/types";

interface CountBadgeProps {
  count: Option<number>;
  variant: "view" | "execute" | "common";
}
export const CountBadge = ({ count, variant }: CountBadgeProps) => (
  <Badge
    border={variant === "common" ? "none" : "1px solid"}
    borderColor={variant === "view" ? "primary.main" : "secondary.dark"}
    bgColor={variant === "common" ? "gray.700" : "transparent"}
    textColor="text.main"
    p="2px 8px"
  >
    {count ?? "N/A"}
  </Badge>
);
