import { FooterCta } from "lib/components/layouts";

interface EvmContractFooterProps {
  handleNext: () => void;
  handlePrevious: () => void;
  isDisabled: boolean;
  actionLabel: string;
}

export const EvmContractFooter = ({
  handleNext,
  handlePrevious,
  isDisabled,
  actionLabel,
}: EvmContractFooterProps) => (
  <FooterCta
    cancelButton={{
      onClick: handlePrevious,
      variant: "outline-primary",
    }}
    cancelLabel="Cancel"
    actionButton={{
      onClick: handleNext,
      isDisabled,
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
