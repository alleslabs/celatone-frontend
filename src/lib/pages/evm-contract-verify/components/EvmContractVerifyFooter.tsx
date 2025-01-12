import { CustomIcon } from "lib/components/icon";
import { FooterCta } from "lib/components/layouts";

interface EvmContractFooterProps {
  handleNext: () => void;
  handlePrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isDisabled: boolean;
}

export const EvmContractFooter = ({
  handleNext,
  handlePrevious,
  hasNext,
  hasPrevious,
  isDisabled,
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
    actionLabel="Verify & Publish Contract"
    sx={{
      backgroundColor: "background.main",
      borderColor: "gray.700",
      display: "grid",
      gridTemplateColumns: "6fr 4fr",
      px: "96px",
      "> div": {
        width: "100%",
      },
    }}
  />
);
