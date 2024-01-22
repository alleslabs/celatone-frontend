import { Button, Flex, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";

import { AllVotesTable } from "./AllVotesTable";
import { ValidatorVotesTable } from "./ValidatorVotesTable";

export const ContentContainer = ({
  children,
  hasSubSection,
}: {
  children: ReactNode;
  hasSubSection?: boolean;
}) => {
  const isMobile = useMobile();
  return (
    <Flex
      direction="column"
      background={isMobile && !hasSubSection ? "transparent" : "gray.900"}
      border="1px solid"
      borderColor={isMobile && !hasSubSection ? "transparent" : "gray.700"}
      borderRadius="8px"
      p={isMobile && !hasSubSection ? 0 : 6}
      gap={4}
    >
      {children}
    </Flex>
  );
};

export const VotingPeriodSection = () => {
  const isMobile = useMobile();
  const validatorVoteDisclosure = useDisclosure();
  const allVoteDisclosure = useDisclosure();

  return (
    <Flex position="relative" overflow="hidden" width="full">
      <Flex
        direction="column"
        w="full"
        position={
          validatorVoteDisclosure.isOpen || allVoteDisclosure.isOpen
            ? "absolute"
            : "relative"
        }
        opacity={
          validatorVoteDisclosure.isOpen || allVoteDisclosure.isOpen ? 0 : 1
        }
        left={
          validatorVoteDisclosure.isOpen || allVoteDisclosure.isOpen
            ? "-100%"
            : "0"
        }
        transition="all 0.25s ease-in-out"
        gap={4}
      >
        {/* Vote Participations */}
        <ContentContainer>
          {!isMobile && <TableTitle title="Vote Participations" mb={0} />}
          Vote Participations Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Soluta pariatur eveniet ducimus quasi veritatis labore aut
          minima adipisci sit sed ratione laboriosam dolorum suscipit tenetur
          reiciendis voluptatum, aliquid quam ullam!
        </ContentContainer>
        {/* Vote Results */}
        <ContentContainer>
          {!isMobile && <TableTitle title="Vote Results" mb={0} />}
          Vote Results Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Soluta pariatur eveniet ducimus quasi veritatis labore aut minima
          adipisci sit sed ratione laboriosam dolorum suscipit tenetur
          reiciendis voluptatum, aliquid quam ullam!
        </ContentContainer>
        <Grid gridTemplateColumns={isMobile ? "1fr " : "1fr 1fr"} gridGap={4}>
          {/* Validator Votes */}
          <GridItem>
            <ContentContainer hasSubSection>
              <Flex alignItems="center" justifyContent="space-between">
                <TableTitle title="Validator Votes" mb={0} />
                <Button
                  variant="ghost-primary"
                  onClick={() => validatorVoteDisclosure.onToggle()}
                  rightIcon={<CustomIcon name="chevron-right" boxSize={3} />}
                >
                  {isMobile ? "View" : "View Details"}
                </Button>
              </Flex>
              Validator Votes Lorem ipsum dolor, sit amet consectetur
              adipisicing elit. Necessitatibus ipsam perspiciatis eius illo
              maiores, magnam architecto nesciunt esse animi obcaecati
              voluptates delectus doloribus magni alias a eligendi odio nam
              iure?
            </ContentContainer>
          </GridItem>
          {/* Recent Votes */}
          <GridItem>
            <ContentContainer hasSubSection>
              <Flex alignItems="center" justifyContent="space-between">
                <TableTitle title="Recent Votes" mb={0} />
                <Button
                  variant="ghost-primary"
                  onClick={() => allVoteDisclosure.onToggle()}
                  rightIcon={<CustomIcon name="chevron-right" boxSize={3} />}
                >
                  {isMobile ? "View" : "View Details"}
                </Button>
              </Flex>
              Recent Votes Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Necessitatibus ipsam perspiciatis eius illo maiores, magnam
              architecto nesciunt esse animi obcaecati voluptates delectus
              doloribus magni alias a eligendi odio nam iure?
            </ContentContainer>
          </GridItem>
        </Grid>
      </Flex>
      <ValidatorVotesTable
        w="full"
        position={validatorVoteDisclosure.isOpen ? "relative" : "absolute"}
        opacity={validatorVoteDisclosure.isOpen ? 1 : 0}
        left={validatorVoteDisclosure.isOpen ? "0" : "100%"}
        onBack={validatorVoteDisclosure.onToggle}
      />
      <AllVotesTable
        w="full"
        position={allVoteDisclosure.isOpen ? "relative" : "absolute"}
        opacity={allVoteDisclosure.isOpen ? 1 : 0}
        left={allVoteDisclosure.isOpen ? "0" : "100%"}
        onBack={allVoteDisclosure.onToggle}
      />
    </Flex>
  );
};
