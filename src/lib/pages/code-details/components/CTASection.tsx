import { Flex, Button, chakra, Icon } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { MdCheck } from "react-icons/md";

import { InstantiateButton } from "lib/components/button";
import { RemoveCodeModal } from "lib/components/modal/code/RemoveCode";
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
    const { isCodeIdSaved } = useCodeStore();
    const isSaved = isCodeIdSaved(id);

    return (
      <Flex gap={4}>
        {isSaved && (
          <SaveOrEditCodeModal
            mode="edit"
            codeLocalInfo={{ id, ...codeInfo }}
          />
        )}
        <InstantiateButton
          instantiatePermission={codeInfo.instantiatePermission}
          permissionAddresses={codeInfo.permissionAddresses}
          codeId={id}
          size="md"
        />
        {isSaved ? (
          <RemoveCodeModal
            codeId={id}
            name={codeInfo.name}
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
          <SaveOrEditCodeModal
            mode="save"
            codeLocalInfo={{ id, ...codeInfo }}
          />
        )}
      </Flex>
    );
  }
);
