import { Heading } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/amino";

import { UploadSection } from "lib/components/upload/UploadSection";
import type { Option, SimulateStatus, UploadSectionState } from "lib/types";

interface UploadNewCodeProps {
  onUploadChange: (formData: UploadSectionState) => void;
  estimatedFee: Option<StdFee>;
  setEstimatedFee: (fee: StdFee | undefined) => void;
  setDefaultBehavior: () => void;
  shouldNotSimulate: boolean;
  simulateStatus: SimulateStatus;
  isSimulating: boolean;
}

export const UploadNewCode = (props: UploadNewCodeProps) => (
  <>
    <Heading as="h6" variant="h6" mb={6}>
      Migrate to new code
    </Heading>
    <UploadSection {...props} />
  </>
);
