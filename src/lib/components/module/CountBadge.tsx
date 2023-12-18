import { Badge } from "@chakra-ui/react";

interface CountBadgeProps {
  count: number | undefined;
  variant: "view" | "execute" | "common";
}
export const CountBadge = ({ count, variant }: CountBadgeProps) => (
  <Badge
    border={variant === "common" ? "none" : "1px solid"}
    borderColor={variant === "view" ? "primary.main" : "accent.dark"}
    bgColor={variant === "common" ? "gray.700" : "transparent"}
    textColor="text.main"
    p="2px 8px"
  >
    {count || "0"}
  </Badge>
);
