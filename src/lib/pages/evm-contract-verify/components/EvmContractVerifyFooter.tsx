import { CustomIcon } from "lib/components/icon";
import { FooterCta } from "lib/components/layouts";

interface EvmContractFooterProps {
  handleNext: () => void;
  handlePrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isDisabled: boolean;
  actionLabel: string;
}

export const EvmContractFooter = ({
  handleNext,
  handlePrevious,
  hasNext,
  hasPrevious,
  isDisabled,
  actionLabel,
}: EvmContractFooterProps) => (
  <FooterCta
    cancelButton={{
      onClick: handlePrevious,
      variant: "outline-primary",
      leftIcon: hasPrevious ? (
        <CustomIcon name="chevron-left" boxSize={4} />
      ) : undefined,
    }}
    cancelLabel={hasPrevious ? "Previous" : "Cancel"}
    actionButton={{
      onClick: handleNext,
      isDisabled,
      rightIcon: hasNext ? (
        <CustomIcon name="chevron-right" boxSize={4} />
      ) : undefined,
    }}
    actionLabel={actionLabel}
    sx={{
      backgroundColor: "background.main",
      borderColor: "gray.700",
      display: "grid",
      gridTemplateColumns: "6fr 4fr",
      pl: 12,
      gap: 0,
      pr: 24,
      "> div": {
        width: "100%",
      },
    }}
  />
);
