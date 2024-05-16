/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { AppLink } from "../AppLink";
import { CustomIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";
import { ModuleInteractionMobileStep } from "lib/pages/interact/types";
import { useVerifyModule } from "lib/services/move/moduleService";
import type { BechAddr, IndexedModule, Option } from "lib/types";

import { CountBadge } from "./CountBadge";

interface ModuleCardProps {
  selectedAddress: BechAddr;
  module: IndexedModule;
  selectedModule: Option<IndexedModule>;
  setSelectedModule?: (module: IndexedModule) => void;
  setStep?: (step: ModuleInteractionMobileStep) => void;
}

export const ModuleCard = ({
  selectedAddress,
  module,
  selectedModule,
  setSelectedModule,
  setStep,
}: ModuleCardProps) => {
  const { data: isVerified } = useVerifyModule({
    address: selectedAddress,
    moduleName: module.moduleName,
  });

  const handleModuleClick = (clickedModule: IndexedModule) => {
    track(AmpEvent.USE_MODULE_CARD, {
      viewCount: clickedModule.viewFunctions.length,
      executeCount: clickedModule.executeFunctions.length,
    });
    setSelectedModule?.(clickedModule);
    setStep?.(ModuleInteractionMobileStep.SelectFunction);
  };

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
        onClick={() => handleModuleClick(module)}
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
