import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import type { Module } from "lib/types";
import { truncate } from "lib/utils";

interface PublicProjectModuleMobileCardProps {
  module: Module;
}
export const PublicProjectModuleMobileCard = ({
  module,
}: PublicProjectModuleMobileCardProps) => {
  const navigate = useInternalNavigate();
  const goToDetail = () => {
    navigate({
      replace: true,
      pathname: "/modules/[address]/[moduleName]/[tab]",
      query: {
        address: module.address,
        moduleName: module.name,
        tab: "overview",
      },
      options: {
        shallow: true,
      },
    });
  };

  return (
    <MobileCardTemplate
      onClick={goToDetail}
      topContent={
        <Flex direction="column">
          <MobileLabel variant="body2" label="Module Path" />
          <Text
            variant="body2"
            onClick={goToDetail}
            color="primary.main"
            transition="all 0.25s ease-in-out"
            _hover={{
              textDecoration: "underline",
              textDecorationColor: "primary.light",
              "& > p": { color: "primary.light" },
            }}
          >
            {truncate(module.address)}::{module.name}
          </Text>
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel variant="body2" label="Owner" />
            <ExplorerLink value={module.address} type="user_address" />
          </Flex>
          <Flex direction="column">
            <MobileLabel variant="body2" label="Description" />
            <Text variant="body2" color="text.dark" whiteSpace="break-spaces">
              {module.description || "N/A"}
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};
