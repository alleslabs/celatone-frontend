import { Flex, Button, chakra, Icon } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { MdCheck } from "react-icons/md";

import { InstantiateButton } from "lib/components/button/InstantiateButton";
import { RemoveCode } from "lib/components/modal/code/RemoveCode";
import { SaveOrEditCodeModal } from "lib/components/modal/code/SaveOrEditCode";
import { useCodeStore } from "lib/hooks";
import type { CodeInfo } from "lib/types";

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "18px",
  },
});

export const CTASection = observer(
  ({ id, ...codeInfo }: Omit<CodeInfo, "contracts">) => {
    const { isCodeIdExist } = useCodeStore();
    const isSaved = isCodeIdExist(id);

    return (
      <Flex gap={4}>
        {isSaved && <SaveOrEditCodeModal mode="edit" id={id} {...codeInfo} />}
        {/* TODO: change permission */}
        <InstantiateButton permission="any" codeId={id} />
        {isSaved ? (
          <RemoveCode
            codeId={id}
            description={codeInfo.description}
            trigger={
              <Button
                variant="outline-gray"
                leftIcon={<StyledIcon as={MdCheck} />}
              >
                Saved
              </Button>
            }
          />
        ) : (
          <SaveOrEditCodeModal mode="save" id={id} {...codeInfo} />
        )}
      </Flex>
    );
  }
);
