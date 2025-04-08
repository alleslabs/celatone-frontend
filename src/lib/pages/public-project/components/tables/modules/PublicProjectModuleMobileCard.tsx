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
            <MobileLabel variant="body2" label="Module path" />
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
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel variant="body2" label="Owner" />
            <ExplorerLink
              value={module.address.toString()}
              type="user_address"
              showCopyOnHover
            />
          </Flex>
          <Flex direction="column">
            <MobileLabel variant="body2" label="Module description" />
            <Text variant="body2" color="text.dark" whiteSpace="break-spaces">
              {module.description || "N/A"}
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};
