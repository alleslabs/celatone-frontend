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
    mainBtnTitle="Save"
    title="Edit Code Name"
    triggerElement={triggerElement}
    codeInfo={codeInfo}
    icon="edit"
    isNewCode={false}
  />
);
