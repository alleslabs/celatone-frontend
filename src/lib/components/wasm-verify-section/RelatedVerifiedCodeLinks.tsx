import { Fragment } from "react";

import { ExplorerLink } from "../ExplorerLink";

interface RelatedVerifiedCodeLinksProps {
  relatedVerifiedCodes: number[];
}

export const RelatedVerifiedCodeLinks = ({
  relatedVerifiedCodes,
}: RelatedVerifiedCodeLinksProps) => {
  const displayedCodes = relatedVerifiedCodes.slice(0, 3);
  return (
    <>
      {displayedCodes.map((code, index) => (
        <Fragment key={code.toString()}>
          <ExplorerLink
            showCopyOnHover
            type="code_id"
            value={code.toString()}
          />
          {relatedVerifiedCodes.length > 2 &&
            index < displayedCodes.length - 1 &&
            ","}
          {index < displayedCodes.length - 1 && " "}
          {index === relatedVerifiedCodes.length - 2 &&
            index < displayedCodes.length - 1 &&
            "and "}
        </Fragment>
      ))}
      {relatedVerifiedCodes.length > 3 && " and more"}
    </>
  );
};
