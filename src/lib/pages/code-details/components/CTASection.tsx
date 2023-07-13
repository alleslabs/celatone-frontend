import { Flex, Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { InstantiateButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { RemoveCodeModal, SaveOrEditCodeModal } from "lib/components/modal";
import { useCodeStore } from "lib/providers/store";
import type { CodeInfo } from "lib/types";

export const CTASection = observer((codeInfo: CodeInfo) => {
  const { isCodeIdSaved, getCodeLocalInfo } = useCodeStore();
  const isSaved = isCodeIdSaved(codeInfo.id);
  return (
    <Flex gap={{ base: 2, md: 4 }} my={{ base: 8, md: 0 }} justify="center">
      {(getCodeLocalInfo(codeInfo.id)?.name || isSaved) && (
        <SaveOrEditCodeModal mode="edit" codeInfo={codeInfo} />
      )}
      <InstantiateButton
        instantiatePermission={codeInfo.instantiatePermission}
        permissionAddresses={codeInfo.permissionAddresses}
        codeId={codeInfo.id}
        size={{ base: "sm", md: "md" }}
      />
      {isSaved ? (
        <RemoveCodeModal
          codeId={codeInfo.id}
          name={codeInfo.name}
          trigger={
            <Button
              variant="outline-gray"
              size={{ base: "sm", md: "md" }}
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
