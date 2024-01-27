import { Flex, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";
import { Tooltip } from "lib/components/Tooltip";

export const DepositPeriodSection = () => {
  const isMobile = useMobile();
  return (
    <Flex
      direction="column"
      background={isMobile ? "transparent" : "gray.900"}
      border="1px solid"
      borderColor={isMobile ? "transparent" : "gray.700"}
      borderRadius="8px"
      p={isMobile ? 0 : 6}
      gap={4}
    >
      {!isMobile && (
        <Flex alignItems="center" justifyContent="space-between">
          <TableTitle title="Depositors" mb={0} />
          <Tooltip
            label="After reaching the total deposit amount, the proposal proceeds to the voting period."
            closeOnClick={false}
          >
            <Flex alignItems="center" gap={1}>
              <Text variant="body2" color="text.dark">
                Total Deposited
                <CustomIcon
                  name="info-circle-solid"
                  color="gray.600"
                  boxSize={3}
                />
              </Text>
            </Flex>
          </Tooltip>
        </Flex>
      )}
      Depositor Tables Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Porro, soluta in molestias saepe vero possimus ullam tempora eum vitae
      provident corporis ab eligendi non facilis quae consequatur beatae quo.
      Nostrum!
    </Flex>
  );
};
