import type { CodeInfo } from "lib/types";

import { CodeDetailsTemplateModal } from "./CodeDetailsTemplate";

interface EditCodeDetailsModalProps {
  codeInfo: CodeInfo;
  triggerElement: JSX.Element;
}
export const EditCodeDetailsModal = ({
  codeInfo,
  triggerElement,
}: EditCodeDetailsModalProps) => (
  <CodeDetailsTemplateModal
    title="Edit code name"
    mainBtnTitle="Save"
    icon="edit"
    isNewCode={false}
    codeInfo={codeInfo}
    triggerElement={triggerElement}
  />
);
