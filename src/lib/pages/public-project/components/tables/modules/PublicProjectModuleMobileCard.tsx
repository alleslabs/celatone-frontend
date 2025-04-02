import type { PublicModule } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { truncate } from "lib/utils";

interface PublicProjectModuleMobileCardProps {
  module: PublicModule;
}
export const PublicProjectModuleMobileCard = ({
  module,
}: PublicProjectModuleMobileCardProps) => {
  const navigate = useInternalNavigate();

  const goToModuleDetails = () => {
    navigate({
      pathname: "/modules/[address]/[moduleName]/[tab]",
      query: {
        address: module.address,
        moduleName: module.name,
        tab: "overview",
      },
    });
  };
  return (
    <MobileCardTemplate
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="Owner" variant="body2" />
            <ExplorerLink
              showCopyOnHover
              type="user_address"
              value={module.address.toString()}
            />
          </Flex>
          <Flex direction="column">
            <MobileLabel label="Module Description" variant="body2" />
            <Text color="text.dark" variant="body2" whiteSpace="break-spaces">
              {module.description || "N/A"}
            </Text>
          </Flex>
        </Flex>
      }
      topContent={
        <Flex align="center" gap={2}>
          <Flex direction="column">
            <MobileLabel label="Module Path" variant="body2" />
            <Text
              color="primary.main"
              variant="body2"
              onClick={goToModuleDetails}
            >
              {truncate(module.address)}::{module.name}
            </Text>
          </Flex>
        </Flex>
      }
      onClick={goToModuleDetails}
    />
  );
};
