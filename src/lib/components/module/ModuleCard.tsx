/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { ModuleInteractionMobileStep } from "lib/pages/interact/types";
import type { MoveVerifyInfoResponse } from "lib/services/types";
import type { IndexedModule, Option } from "lib/types";
import { resolveMoveVerifyStatus } from "lib/utils";

import { CountBadge } from "./CountBadge";
import { AppLink } from "../AppLink";
import { CustomIcon } from "../icon";
import { MoveVerifyBadge } from "../MoveVerifyBadge";

interface ModuleCardProps {
  module: IndexedModule;
  selectedModule: Option<IndexedModule>;
  moveVerifyInfo: Option<MoveVerifyInfoResponse>;
  setSelectedModule?: (module: IndexedModule) => void;
  setStep?: (step: ModuleInteractionMobileStep) => void;
  readOnly?: boolean;
}

export const ModuleCard = ({
  module,
  moveVerifyInfo,
  selectedModule,
  setSelectedModule,
  setStep,
  readOnly = false,
}: ModuleCardProps) => {
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
        cursor={readOnly ? "default" : "pointer"}
        gap={1}
        templateColumns="20px 1fr auto"
        onClick={() => (readOnly ? null : handleModuleClick(module))}
        _hover={{ bg: readOnly ? "unset" : "gray.700" }}
        transition=".25s all ease-out"
      >
        <CustomIcon name="contract-address" color="primary.main" boxSize={3} />
        <Flex align="center" overflow="hidden" gap={1}>
          <Text className="ellipsis" variant="body2">
            {module.moduleName}
          </Text>
          <MoveVerifyBadge
            status={resolveMoveVerifyStatus(
              module.digest,
              moveVerifyInfo?.digest
            )}
          />
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
      JSON.stringify(module),
      JSON.stringify(moveVerifyInfo),
      selectedModule?.moduleName,
      setSelectedModule,
    ]
  );

  return setSelectedModule || readOnly ? (
    card
  ) : (
    <AppLink href={`/modules/${module.address}/${module.moduleName}`}>
      {card}
    </AppLink>
  );
};
