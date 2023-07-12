import { CustomIcon } from "lib/components/icon";

export const ErrorFetching = () => (
  <>
    <CustomIcon name="alert-circle-solid" color="gray.600" boxSize={4} mr={3} />
    <p>Error fetching data. Please try again later.</p>
  </>
);
