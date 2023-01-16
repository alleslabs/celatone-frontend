import type { CodeLocalInfo } from "lib/stores/code";

import { CodeDetailsTemplate } from "./CodeDetailsTemplate";

interface SaveCodeDetailsProps {
  codeLocalInfo: CodeLocalInfo;
  triggerElement: JSX.Element;
}
export const SaveCodeDetails = ({
  codeLocalInfo,
  triggerElement,
}: SaveCodeDetailsProps) => (
  <CodeDetailsTemplate
    title="Save New Code"
    helperText={`Save other stored codes to your "Saved Codes" list`}
    mainBtnTitle="Save New Code"
    isNewCode
    codeLocalInfo={codeLocalInfo}
    triggerElement={triggerElement}
  />
);
