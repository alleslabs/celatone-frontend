import type { Option } from "lib/types";
import type { ReactNode } from "react";

import { TableTitle } from "lib/components/table";

interface AccountSectionWrapperProps {
  children: ReactNode;
  title: string;
  totalData?: Option<number>;
  helperText?: string;
  hasHelperText?: boolean;
  showCount?: boolean;
}
const AccountSectionWrapper = ({
  children,
  hasHelperText,
  helperText,
  showCount = true,
  title,
  totalData,
}: AccountSectionWrapperProps) => (
  <>
    <TableTitle
      count={totalData}
      helperText={hasHelperText ? helperText : undefined}
      mb={2}
      showCount={showCount}
      title={title}
    />
    {children}
  </>
);

export default AccountSectionWrapper;
