import { useTierConfig } from "lib/app-provider";

interface TierSwitcherProps {
  full: React.ReactNode;
  newmetric?: React.ReactNode;
  lite: React.ReactNode;
}

export const TierSwitcher = ({ full, newmetric, lite }: TierSwitcherProps) => {
  const { tier } = useTierConfig();

  switch (tier) {
    case "full":
      return full;
    case "newmetric":
      return newmetric;
    case "lite":
    default:
      return lite;
  }
};
