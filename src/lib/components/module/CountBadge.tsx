import type { Option } from "lib/types";

import { Badge } from "@chakra-ui/react";

interface CountBadgeProps {
  count: Option<number>;
  variant: "view" | "execute" | "common";
}
export const CountBadge = ({ count, variant }: CountBadgeProps) => (
  <Badge
    bgColor={variant === "common" ? "gray.700" : "transparent"}
    border={variant === "common" ? "none" : "1px solid"}
    borderColor={variant === "view" ? "primary.main" : "secondary.dark"}
    p="2px 8px"
    textColor="text.main"
  >
    {count ?? "N/A"}
  </Badge>
);
