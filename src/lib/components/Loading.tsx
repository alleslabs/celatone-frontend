import { Spinner, Text } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <>
      <Spinner size="xl" speed="0.65s" />
      <Text mt="20px">Loading ...</Text>
    </>
  );
};
