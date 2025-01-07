/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { AppLink } from "../AppLink";
import { CustomIcon } from "../icon";
import { MoveVerifyBadge } from "../MoveVerifyBadge";
import { AmpEvent, track } from "lib/amplitude";
import { ModuleInteractionMobileStep } from "lib/pages/interact/types";
import type { MoveVerifyInfoResponse } from "lib/services/types";
import type { IndexedModule, Option } from "lib/types";
import { resolveMoveVerifyStatus } from "lib/utils";

import { CountBadge } from "./CountBadge";

interface ModuleCardProps {
  module: IndexedModule;
  moveVerifyInfo: Option<MoveVerifyInfoResponse>;
  readOnly?: boolean;
  selectedModule: Option<IndexedModule>;
  setSelectedModule?: (module: IndexedModule) => void;
  setStep?: (step: ModuleInteractionMobileStep) => void;
}

export const ModuleCard = ({
  module,
  moveVerifyInfo,
  readOnly = false,
  selectedModule,
  setSelectedModule,
  setStep,
}: ModuleCardProps) => {
  const handleModuleClick = (clickedModule: IndexedModule) => {
    track(AmpEvent.USE_MODULE_CARD, {
      executeCount: clickedModule.executeFunctions.length,
      viewCount: clickedModule.viewFunctions.length,
    });
    setSelectedModule?.(clickedModule);
    setStep?.(ModuleInteractionMobileStep.SelectFunction);
  };

  const card = useMemo(
    () => (
      <Grid
        alignItems="center"
        gap={1}
        p={4}
        _hover={{ bg: readOnly ? "unset" : "gray.700" }}
        bgColor={
          module.moduleName === selectedModule?.moduleName
            ? "gray.700"
            : "gray.800"
        }
        borderRadius={8}
        cursor={readOnly ? "default" : "pointer"}
        onClick={() => (readOnly ? null : handleModuleClick(module))}
        templateColumns="20px 1fr auto"
        transition=".25s all ease-out"
      >
        <CustomIcon name="contract-address" boxSize={3} color="primary.main" />
        <Flex align="center" gap={1} overflow="hidden">
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
          <CountBadge variant="view" count={module.viewFunctions.length} />
          <CountBadge
            variant="execute"
            count={module.executeFunctions.length}
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
