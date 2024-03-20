import { ErrorFetching } from "lib/components/state";

interface ErrorFetchingProposalInfosProps {
  isParamsOnly?: boolean;
}

export const ErrorFetchingProposalInfos = ({
  isParamsOnly = false,
}: ErrorFetchingProposalInfosProps) => (
  <ErrorFetching
    dataName={`proposal params${!isParamsOnly && " and votes tally"}`}
  />
);
