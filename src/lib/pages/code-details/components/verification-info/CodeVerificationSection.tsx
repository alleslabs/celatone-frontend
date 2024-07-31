import { Flex, Heading } from "@chakra-ui/react";

import {
  VerificationBadge,
  VerificationStatus,
} from "lib/components/VerificationBadge";

import { FailedDetails } from "./components/FailedDetails";
import { IndirectlyVerifiedDetails } from "./components/IndirectlyVerifiedDetails";
import { InProgressDetails } from "./components/InProgressDetails";
import { NotVerifiedDetails } from "./components/NotVerifiedDetails";
import { VerifiedDetails } from "./components/VerifiedDetails";

interface CodeVerificationSectionProps {
  status: VerificationStatus;
  codeId: number;
  codeHash: string;
}

const CodeVerificationSectionBody = ({
  status,
  codeId,
  codeHash,
}: CodeVerificationSectionProps) => {
  switch (status) {
    case VerificationStatus.IN_PROGRESS:
      return <InProgressDetails />;
    case VerificationStatus.VERIFIED:
      return <VerifiedDetails />;
    case VerificationStatus.INDIRECTLY_VERIFIED:
      return <IndirectlyVerifiedDetails codeId={codeId} codeHash={codeHash} />;
    case VerificationStatus.FAILED:
      return (
        <FailedDetails
          codeId={codeId}
          codeHash={codeHash}
          submittedTime="2021-09-01"
        />
      );
    case VerificationStatus.NOT_VERIFIED:
    default:
      return <NotVerifiedDetails codeId={codeId} codeHash={codeHash} />;
  }
};

export const CodeVerificationSection = ({
  status,
  codeId,
  codeHash,
}: CodeVerificationSectionProps) => (
  <Flex direction="column" my={8} gap={4}>
    <Flex gap={2} alignItems="center">
      <Heading as="h6" variant="h6">
        Verification Info
      </Heading>
      <VerificationBadge hasText status={status} type="code" />
    </Flex>
    <Flex background="gray.900" borderRadius={8} px={6} py={4}>
      <Flex justifyContent="space-between" alignItems="center" w="full" gap={2}>
        <CodeVerificationSectionBody
          status={status}
          codeId={codeId}
          codeHash={codeHash}
        />
      </Flex>
    </Flex>
  </Flex>
);
