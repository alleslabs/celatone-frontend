import { Box } from "@chakra-ui/react";
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
  <Box
    position="sticky"
    bottom={0}
    borderTop="1px"
    borderColor="gray.700"
    px={12}
    zIndex={2}
  >
    <FooterCta
      cancelButton={{
        onClick: handlePrevious,
      }}
      cancelLabel="Cancel"
      actionButton={{
        onClick: handleNext,
        isDisabled,
      }}
      actionLabel={actionLabel}
      sx={{
        backgroundColor: "background.main",
        columnGap: "32px",
        display: "grid",
        gridTemplateColumns: "6fr 4fr",
        maxW: "1080px",
        mx: "auto",
        "> div": {
          width: "100%",
        },
      }}
    />
  </Box>
);
