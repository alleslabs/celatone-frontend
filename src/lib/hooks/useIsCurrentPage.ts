import { useRouter } from "next/router";
import { useCallback } from "react";

export const useIsCurrentPage = () => {
  const router = useRouter();
  const { network } = router.query;
  const pathName = router.asPath;
  return useCallback(
    (slug: string) => {
      const networkPath = network ? `/${network}` : "";
      switch (slug) {
        // handle home page
        case "/":
          return pathName === `${networkPath}` || pathName === "/";
        // handle contract list page and public project page
        case "/contract-list":
        case "/public-projects":
          return pathName === `${networkPath}${slug}`;
        // handle page with query param
        default:
          return pathName.includes(`${networkPath}${slug}`);
      }
    },
    [network, pathName]
  );
};
