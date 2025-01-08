import { Flex, Text } from "@chakra-ui/react";

import { useGetAddressType, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { RemarkOperation } from "lib/types";
import type { ContractInfo } from "lib/types";

interface ContractInstantiatorCellProps {
  contractInfo: ContractInfo;
  isReadOnly: boolean;
}

export const ContractInstantiatorCell = ({
  contractInfo: { instantiator, latestUpdater, remark },
  isReadOnly,
}: ContractInstantiatorCellProps) => {
  const isMobile = useMobile();
  const getAddressType = useGetAddressType();

  /**
   * @remarks handle the case where the data is too old and cannot be found
   */
  if (!latestUpdater)
    return instantiator ? (
      <ExplorerLink
        isReadOnly={isReadOnly}
        type={getAddressType(instantiator)}
        value={instantiator}
        showCopyOnHover
      />
    ) : (
      <Text variant="body2" color="text.dark">
        N/A
      </Text>
    );

  const updaterType = getAddressType(latestUpdater);

  switch (remark?.operation) {
    case RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS:
      return (
        <Text variant="body2" color="text.dark" cursor="text">
          Genesis
        </Text>
      );
    case RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT:
      return (
        <ExplorerLink
          isReadOnly={isReadOnly}
          type={updaterType}
          value={latestUpdater}
          showCopyOnHover
        />
      );
    case RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE:
      return (
        <Flex direction="column" onClick={(e) => e.stopPropagation()}>
          {!isMobile && (
            <Text variant="body3" color="text.dark">
              Migrated by
            </Text>
          )}
          <ExplorerLink
            isReadOnly={isReadOnly}
            type={updaterType}
            value={latestUpdater}
            showCopyOnHover
          />
        </Flex>
      );
    default:
      return (
        <Text variant="body2" color="text.dark">
          N/A
        </Text>
      );
  }
};
