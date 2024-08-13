import { TableContainer } from "../tableComponents";

import { ModuleVerificationDetailsTableHeader } from "./ModuleVerificationDetailsTableHeader";

export const ModuleVerificationDetailsTable = () => {
  const templateColumns = "1fr";

  return (
    <TableContainer>
      <ModuleVerificationDetailsTableHeader templateColumns={templateColumns} />
    </TableContainer>
  );
};
