import { Alert, AlertDescription, Flex, Heading } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { MobileTitle } from "lib/components/table";

interface VotedProposalsTableProps {
  onViewMore?: () => void;
}
export const VotedProposalsTable = ({
  onViewMore,
}: VotedProposalsTableProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
  return (
    <>
      {isMobileOverview ? (
        <MobileTitle
          title="Voted Proposals"
          count={10}
          onViewMore={onViewMore}
        />
      ) : (
        <Flex direction="column" gap={{ base: 4, md: 6 }}>
          <Heading as="h6" variant="h6">
            Voted Proposals
          </Heading>
          {!onViewMore && (
            <Alert variant="info" gap={2}>
              <CustomIcon
                name="info-circle-solid"
                boxSize={4}
                color="gray.400"
              />
              <AlertDescription>
                Kindly note that the validator may not have voted on the
                proposal due to ineligibility, such as being recently added to
                the network.
              </AlertDescription>
            </Alert>
          )}
          {isMobile ? <Flex>mobile table</Flex> : <Flex>table</Flex>}
        </Flex>
      )}
    </>
  );
};
