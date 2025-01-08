import { useTierConfig } from "lib/app-provider";

interface TierSwitcherProps {
  full: React.ReactNode;
  sequencer?: React.ReactNode;
  mesa?: React.ReactNode;
  lite?: React.ReactNode;
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
    case "sequencer":
      return sequencer ?? lite;
    case "mesa":
      return mesa ?? lite;
    case "lite":
    default:
      return lite;
  }
};
