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
    borderColor="gray.700"
    borderStyle="solid"
    borderTopWidth="1px"
    bottom={0}
    position="sticky"
    px={12}
    zIndex={2}
  >
    <FooterCta
      actionButton={{
        onClick: handleNext,
        isDisabled,
      }}
      actionLabel={actionLabel}
      cancelButton={{
        onClick: handlePrevious,
      }}
      cancelLabel="Cancel"
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
