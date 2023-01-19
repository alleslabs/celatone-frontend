import { Heading } from "@chakra-ui/react";

import { UploadSection } from "lib/components/upload/UploadSection";

interface UploadNewCodeProps {
  handleBack: () => void;
}

export const UploadNewCode = ({ handleBack }: UploadNewCodeProps) => (
  <>
    <Heading as="h6" variant="h6" mb="24px">
      Migrate to new code
    </Heading>
    <UploadSection handleBack={handleBack} onMigrate />
  </>
);
