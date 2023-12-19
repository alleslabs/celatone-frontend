import { EmptyState } from "./EmptyState";

interface ErrorFetchingProps {
  dataName: string;
  withBorder?: boolean;
}

export const ErrorFetching = ({
  dataName,
  withBorder = false,
}: ErrorFetchingProps) => (
  <EmptyState
    imageVariant="error"
    message={`There is an error during fetching ${dataName}. Please try again later.`}
    withBorder={withBorder}
  />
);
