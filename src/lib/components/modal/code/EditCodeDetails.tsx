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
    title="Edit Code Name"
    mainBtnTitle="Save"
    icon="edit"
    isNewCode={false}
    codeInfo={codeInfo}
    triggerElement={triggerElement}
  />
);
