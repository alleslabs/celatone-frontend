import { Flex, Button, chakra, Icon } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { MdCheck } from "react-icons/md";

import { InstantiateButton } from "lib/components/button";
import { RemoveCodeModal, SaveOrEditCodeModal } from "lib/components/modal";
import { useCodeStore } from "lib/providers/store";
import type { CodeInfo } from "lib/types";

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "18px",
  },
});

export const CTASection = observer((codeInfo: CodeInfo) => {
  const { isCodeIdSaved } = useCodeStore();
  const isSaved = isCodeIdSaved(codeInfo.id);

  return (
    <Flex gap={4}>
      {isSaved && <SaveOrEditCodeModal mode="edit" codeInfo={codeInfo} />}
      <InstantiateButton
        instantiatePermission={codeInfo.instantiatePermission}
        permissionAddresses={codeInfo.permissionAddresses}
        codeId={codeInfo.id}
        size="md"
      />
      {isSaved ? (
        <RemoveCodeModal
          codeId={codeInfo.id}
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
        <SaveOrEditCodeModal mode="save" codeInfo={codeInfo} />
      )}
    </Flex>
  );
});
