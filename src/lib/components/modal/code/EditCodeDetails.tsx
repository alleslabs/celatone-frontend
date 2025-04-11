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
    codeInfo={codeInfo}
    icon="edit"
    isNewCode={false}
    mainBtnTitle="Save"
    title="Edit code name"
    triggerElement={triggerElement}
  />
);
