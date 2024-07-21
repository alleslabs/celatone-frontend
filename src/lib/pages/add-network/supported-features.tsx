import { Checkbox, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

import { AddNetworkHeader } from "./components/AddNetworkHeader";
import { AddNetworkSubheader } from "./components/AddNetworkSubheader";

const initialFeatures = [
  { label: "Wasm", isChecked: false },
  { label: "Move", isChecked: false },
  { label: "NFTs", isChecked: false },
];

const SupportedFeatures = () => {
  const [features, setFeatures] = useState(initialFeatures);
  const handleCheckboxChange = (index: number) => {
    const newFeatures = [...features];
    newFeatures[index].isChecked = !newFeatures[index].isChecked;
    setFeatures(newFeatures);
  };

  return (
    <Flex direction="column" gap={2} alignItems="center">
      <AddNetworkHeader title="Select Supported Features" />
      <Flex w="full" direction="column" gap={6} my={8}>
        <AddNetworkSubheader
          title="Feature Lists"
          subtitle="Choose supported features for your custom Minitia. This can be changed later."
        />
        <Flex direction="column" gap={4}>
          {features.map((feature, index) => (
            <Flex
              key={feature.label}
              alignItems="center"
              p={4}
              mb={2}
              bg="gray.900"
              borderRadius={8}
              border="1px solid"
              borderColor={feature.isChecked ? "gray.400" : "transparent"}
              cursor="pointer"
              transition="all 0.25s ease-in-out"
              onClick={() => handleCheckboxChange(index)}
              _hover={{
                background: "gray.800",
              }}
            >
              <Checkbox
                isChecked={feature.isChecked}
                size="lg"
                mr={4}
                variant="white"
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(index);
                }}
              />
              <Text color="white" fontSize="md">
                {feature.label}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SupportedFeatures;
