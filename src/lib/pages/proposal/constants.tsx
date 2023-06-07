import type { SidebarMetadata } from "lib/components/StickySidebar";

export type NetworkPermission = "permissioned" | "permissionless";

export const SIDEBAR_DETAILS: (
  chainName: string,
  permission: NetworkPermission
) => SidebarMetadata = (chainName, permission) =>
  ({
    permissioned: {
      title: "What is whitelisted address?",
      description: (
        <span>
          {chainName} is a permissioned chain, which means you will need to
          submit proposal to store code.
          <br />
          <br />
          However, there is a way to bypass this process by adding your wallet
          address or other designated addresses to an allowed list.
          <br />
          <br />
          Once your address is on this list, you will be able to store code on
          the network without having to submit a proposal every time.
        </span>
      ),
      toStoreCode: true,
    },
    permissionless: {
      title:
        "Do I need to open proposal to whitelisting in permissionless network?",
      description: (
        <span>
          {chainName} does not require whitelisting permission. Nonetheless, if
          you want to understand how the whitelisting process works, you can try
          submitting a proposal for whitelisting.
          <br />
          <br />
          On the mainnet, storing code requires a proposal to be submitted, but
          it is possible to add your wallet address or other specified addresses
          to an allowed list.
        </span>
      ),
    },
  }[permission]);
