import type { StdFee } from "@cosmjs/amino";
import type { Option, SimulateStatus, UploadSectionState } from "lib/types";
import type { UseFormReturn } from "react-hook-form";

import { Heading } from "@chakra-ui/react";
import { UploadSection } from "lib/components/upload";

interface UploadNewCodeProps {
  estimatedFee: Option<StdFee>;
  formData: UseFormReturn<UploadSectionState>;
  isSimulating: boolean;
  setDefaultBehavior: () => void;
  setEstimatedFee: (fee: StdFee | undefined) => void;
  shouldNotSimulate: boolean;
  simulateStatus: SimulateStatus;
}

export const UploadNewCode = (props: UploadNewCodeProps) => (
  <>
    <Heading as="h6" mb={6} variant="h6">
      Migrate to new code
    </Heading>
    <UploadSection {...props} />
  </>
);
