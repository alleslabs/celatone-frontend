import { Text, Flex, Heading, Button, FormControl } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { Option } from "lib/types";

import { OffChainDetail } from "./OffChainDetail";

interface OffChainFormProps {
  title?: string;
  subtitle?: string;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  lists: Option[];
  setLists: Dispatch<SetStateAction<Option[]>>;
  cta?: boolean;
}

export const OffChainForm = ({
  title,
  subtitle,
  name,
  setName,
  description,
  setDescription,
  tags,
  setTags,
  lists,
  setLists,
  cta = true,
}: OffChainFormProps) => {
  return (
    <Flex direction="column" gap={8}>
      {title && (
        <Flex direction="column" gap={1}>
          <Heading as="h6" variant="h6" color="text.main">
            {title}
          </Heading>
          <Text color="text.dark">{subtitle}</Text>
        </Flex>
      )}
      <FormControl>
        <Flex direction="column">
          <OffChainDetail
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            tags={tags}
            setTags={setTags}
            lists={lists}
            setLists={setLists}
          />
        </Flex>
        {cta && (
          <Flex gap={6} w="full" pt={12} justifyContent="center">
            <Button w="128px">Save</Button>
            <Button w="128px" variant="outline-gray">
              Skip
            </Button>
          </Flex>
        )}
      </FormControl>
    </Flex>
  );
};
