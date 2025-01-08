import { Button, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { InstantiateButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { RemoveCodeModal, SaveOrEditCodeModal } from "lib/components/modal";
import { useCodeStore } from "lib/providers/store";
import type { CodeInfo } from "lib/types";

export const CtaSection = observer((codeInfo: CodeInfo) => {
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();
  const isSaved = isCodeIdSaved(codeInfo.id);
  return (
    <Flex gap={{ base: 2, md: 4 }} justify="center" my={{ base: 8, md: 0 }}>
      {(getCodeLocalInfo(codeInfo.id)?.name || isSaved) && (
        <SaveOrEditCodeModal codeInfo={codeInfo} mode="edit" />
      )}
      <InstantiateButton
        size={{ base: "sm", md: "md" }}
        codeId={codeInfo.id}
        instantiatePermission={codeInfo.instantiatePermission}
        permissionAddresses={codeInfo.permissionAddresses}
      />
      {isSaved ? (
        <RemoveCodeModal
          name={codeInfo.name}
          trigger={
            <Button
              size={{ base: "sm", md: "md" }}
              variant="outline-gray"
              leftIcon={<CustomIcon name="check" />}
            >
              Saved
            </Button>
          }
          codeId={codeInfo.id}
        />
      ) : (
        <SaveOrEditCodeModal codeInfo={codeInfo} mode="save" />
      )}
    </Flex>
  );
});
