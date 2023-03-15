import { Flex, Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { InstantiateButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { RemoveCodeModal, SaveOrEditCodeModal } from "lib/components/modal";
import { useCodeStore } from "lib/providers/store";
import type { CodeInfo } from "lib/types";

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
              leftIcon={<CustomIcon name="check" />}
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
