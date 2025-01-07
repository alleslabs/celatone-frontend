/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useEffect } from "react";

import { amp } from "lib/amplitude";
import {
  useCelatoneApp,
  useCurrentChain,
  useMobile,
  useNavContext,
} from "lib/app-provider";
import { StorageKeys } from "lib/data";
import { useLocalStorage } from "lib/hooks";
import { hashAddress } from "lib/utils";

export const AmplitudeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { pathname } = useRouter();
  const { address } = useCurrentChain();
  const { currentChainId } = useCelatoneApp();
  const isMobile = useMobile();
  const { isExpand, submenus } = useNavContext();
  const isDevExpand = submenus[StorageKeys.DevSidebar][0];
  const isProjectExpand = submenus[StorageKeys.ProjectSidebar][0];

  const [wallets, setWallets] = useLocalStorage<string[]>(
    StorageKeys.Wallets,
    []
  );
  const [networks, setNetworks] = useLocalStorage<string[]>(
    StorageKeys.Networks,
    []
  );
  const rawAddressHash = hashAddress(address);
  if (!!rawAddressHash && !wallets.includes(rawAddressHash))
    setWallets([...wallets, rawAddressHash]);
  if (!networks.includes(currentChainId))
    setNetworks([...networks, currentChainId]);

  useEffect(
    () =>
      amp.setUserIdentity(
        wallets,
        networks,
        isExpand,
        isDevExpand,
        isProjectExpand
      ),

    [
      JSON.stringify(wallets),
      JSON.stringify(networks),
      isExpand,
      isDevExpand,
      isProjectExpand,
    ]
  );

  amp.setMandatoryProperties({
    chain: currentChainId,
    devSidebar: submenus[StorageKeys.DevSidebar][0],
    mobile: isMobile,
    navSidebar: isExpand,
    page: pathname,
    projectSidebar: submenus[StorageKeys.ProjectSidebar][0],
    rawAddressHash: hashAddress(address) ?? "Not Connected",
  });

  return <>{children}</>;
};
