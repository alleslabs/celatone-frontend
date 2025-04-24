import type { CodeInfo } from "lib/types";

import { Button, Flex } from "@chakra-ui/react";
import { InstantiateButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { RemoveCodeModal, SaveOrEditCodeModal } from "lib/components/modal";
import { useCodeStore } from "lib/providers/store";
import { observer } from "mobx-react-lite";

export const CtaSection = observer((codeInfo: CodeInfo) => {
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();
  const isSaved = isCodeIdSaved(codeInfo.id);
  return (
    <Flex gap={{ base: 2, md: 4 }} justify="center" my={{ base: 8, md: 0 }}>
      {(getCodeLocalInfo(codeInfo.id)?.name || isSaved) && (
        <SaveOrEditCodeModal codeInfo={codeInfo} mode="edit" />
      )}
      <InstantiateButton
        codeId={codeInfo.id}
        instantiatePermission={codeInfo.instantiatePermission}
        permissionAddresses={codeInfo.permissionAddresses}
        size={{ base: "sm", md: "md" }}
      />
      {isSaved ? (
        <RemoveCodeModal
          codeId={codeInfo.id}
          name={codeInfo.name}
          trigger={
            <Button
              leftIcon={<CustomIcon name="check" />}
              size={{ base: "sm", md: "md" }}
              variant="outline-gray"
            >
              Saved
            </Button>
          }
        />
      ) : (
        <SaveOrEditCodeModal codeInfo={codeInfo} mode="save" />
      )}
    </Flex>
  );
});
