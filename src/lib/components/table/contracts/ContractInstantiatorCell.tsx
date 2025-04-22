import type { ContractInfo } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useGetAddressType, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { RemarkOperation } from "lib/types";

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
        showCopyOnHover
        type={getAddressType(instantiator)}
        value={instantiator}
      />
    ) : (
      <Text color="text.dark" variant="body2">
        N/A
      </Text>
    );

  const updaterType = getAddressType(latestUpdater);

  switch (remark?.operation) {
    case RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS:
      return (
        <Text color="text.dark" cursor="text" variant="body2">
          Genesis
        </Text>
      );
    case RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT:
      return (
        <ExplorerLink
          isReadOnly={isReadOnly}
          showCopyOnHover
          type={updaterType}
          value={latestUpdater}
        />
      );
    case RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE:
      return (
        <Flex direction="column" onClick={(e) => e.stopPropagation()}>
          {!isMobile && (
            <Text color="text.dark" variant="body3">
              Migrated by
            </Text>
          )}
          <ExplorerLink
            isReadOnly={isReadOnly}
            showCopyOnHover
            type={updaterType}
            value={latestUpdater}
          />
        </Flex>
      );
    default:
      return (
        <Text color="text.dark" variant="body2">
          N/A
        </Text>
      );
  }
};
