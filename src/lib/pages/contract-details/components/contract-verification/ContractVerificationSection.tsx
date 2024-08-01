import { Flex } from "@chakra-ui/react";

import { StatusMessageBox } from "lib/components/StatusMessageBox";
import { VerificationStatus } from "lib/services/types";

import { FailedDetails } from "./FailedDetails";
import { IndirectlyVerifiedDetails } from "./IndirectlyVerifiedDetails";
import { InProgressDetails } from "./InProgressDetails";
import { NotVerifiedDetails } from "./NotVerifiedDetails";
import { VerifiedDetails } from "./VerifiedDetails";

interface ContractVerificationSectionProps {
  status: VerificationStatus;
  codeId: number;
  codeHash: string;
}

const ContractVerificationSectionBody = ({
  status,
  codeId,
  codeHash,
}: ContractVerificationSectionProps) => {
  switch (status) {
    case VerificationStatus.IN_PROGRESS:
      return <InProgressDetails codeId={codeId} />;
    case VerificationStatus.VERIFIED:
      return <VerifiedDetails codeId={codeId} />;
    case VerificationStatus.INDIRECTLY_VERIFIED:
      return <IndirectlyVerifiedDetails codeId={codeId} codeHash={codeHash} />;
    case VerificationStatus.FAILED:
      return (
        <FailedDetails
          codeId={codeId}
          submittedTime="2021-09-01"
          codeHash={codeHash}
        />
      );
    case VerificationStatus.NOT_VERIFIED:
    default:
      return <NotVerifiedDetails codeId={codeId} codeHash={codeHash} />;
  }
};

export const ContractVerificationSection = ({
  codeHash,
  codeId,
  status,
}: ContractVerificationSectionProps) => (
  <Flex direction="column" mb={6} gap={4}>
    <Flex justifyContent="space-between" alignItems="center" w="full" gap={2}>
      <StatusMessageBox
        content={
          <ContractVerificationSectionBody
            status={status}
            codeHash={codeHash}
            codeId={codeId}
          />
        }
      />
    </Flex>
  </Flex>
);
