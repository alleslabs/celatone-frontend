import { useTierConfig } from "lib/app-provider";

interface TierSwitcherProps {
  full: React.ReactNode;
  lite?: React.ReactNode;
  mesa?: React.ReactNode;
  sequencer?: React.ReactNode;
}

export const TierSwitcher = ({
  full,
  lite,
  mesa,
  sequencer,
}: TierSwitcherProps) => {
  const { tier } = useTierConfig();

  switch (tier) {
    case "full":
      return full;
    case "mesa":
      return mesa ?? lite;
    case "sequencer":
      return sequencer ?? lite;
    case "lite":
    default:
      return lite;
  }
};
