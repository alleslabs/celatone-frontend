/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { AppLink } from "../AppLink";
import { CustomIcon } from "../icon";
import type { IndexedModule } from "lib/services/move/moduleService";
import { useVerifyModule } from "lib/services/move/moduleService";
import type { MoveAccountAddr, Option } from "lib/types";

import { CountBadge } from "./CountBadge";

interface ModuleCardProps {
  selectedAddress: MoveAccountAddr;
  module: IndexedModule;
  selectedModule: Option<IndexedModule>;
  setSelectedModule?: (module: IndexedModule) => void;
}

export const ModuleCard = ({
  selectedAddress,
  module,
  selectedModule,
  setSelectedModule,
}: ModuleCardProps) => {
  const { data: isVerified } = useVerifyModule({
    address: selectedAddress,
    moduleName: module.moduleName,
  });

  const card = useMemo(
    () => (
      <Grid
        borderRadius={8}
        bgColor={
          module.moduleName === selectedModule?.moduleName
            ? "gray.700"
            : "gray.800"
        }
        p={4}
        alignItems="center"
        cursor="pointer"
        onClick={() => setSelectedModule?.(module)}
        gap={1}
        templateColumns="20px 1fr auto"
        _hover={{
          bg: "gray.700",
        }}
        transition=".25s all ease-out"
      >
        <CustomIcon name="contract-address" color="primary.main" boxSize={3} />
        <Flex align="center" overflow="hidden" gap={1}>
          <Text className="ellipsis" variant="body2">
            {module.moduleName}
          </Text>
          {isVerified && (
            <CustomIcon
              name="check-circle-solid"
              color="success.main"
              boxSize={3}
            />
          )}
        </Flex>
        <Flex gap={1} ml="auto">
          <CountBadge count={module.viewFunctions.length} variant="view" />
          <CountBadge
            count={module.executeFunctions.length}
            variant="execute"
          />
        </Flex>
      </Grid>
    ),
    [
      isVerified,
      JSON.stringify(module),
      selectedModule?.moduleName,
      setSelectedModule,
    ]
  );

  return setSelectedModule ? (
    card
  ) : (
    <AppLink href={`/modules/${module.address}/${module.moduleName}`}>
      {card}
    </AppLink>
  );
};
