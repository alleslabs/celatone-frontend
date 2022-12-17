import { Flex, Button, Icon, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdOutlineAdd, MdBookmarkBorder, MdSearch } from "react-icons/md";

import { SaveNewContract } from "lib/components/modal/contract";
import type { Option } from "lib/types";

interface ZeroStateProps {
  list: Option;
  isReadOnly: boolean;
}

export const ZeroState = ({ list, isReadOnly }: ZeroStateProps) => {
  const router = useRouter();
  return (
    <Flex alignItems="center" flexDir="column" gap="4">
      <Icon as={MdSearch} color="gray.600" boxSize="16" />
      <Text color="gray.500">
        You don’t have any deployed or saved contracts.
      </Text>
      {!isReadOnly && (
        <>
          <Flex alignItems="center" gap="2">
            <Text color="gray.500">You can</Text>
            <Button
              rightIcon={<MdOutlineAdd />}
              onClick={() => router.push("/deploy")}
            >
              Deploy New Contract
            </Button>
          </Flex>
          <Flex alignItems="center" gap="2">
            <Text color="gray.500">
              or save deployed contract to the list with
            </Text>
            <SaveNewContract
              list={list}
              buttonProps={{
                variant: "outline-primary",
                rightIcon: <MdBookmarkBorder />,
                children: "Save Contract",
              }}
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};
