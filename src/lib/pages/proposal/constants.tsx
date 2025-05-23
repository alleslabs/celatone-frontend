import type { SidebarMetadata } from "lib/components/StickySidebar";

import { trackUseRightHelperPanel } from "lib/amplitude";
import { AppLink } from "lib/components/AppLink";

export type NetworkPermission = "permissioned" | "permissionless";

const whitelistPage = "proposal-whitelist";
export const SIDEBAR_WHITELIST_DETAILS: (
  chainName: string,
  permission: NetworkPermission
) => SidebarMetadata = (chainName, permission) =>
  ({
    permissioned: {
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
      page: whitelistPage,
      title: "What is whitelisted address?",
      toPage: true,
      toPagePath: "/proposals/store-code",
      toPageTitle: "Submit proposal to store code",
    },
    permissionless: {
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
      page: whitelistPage,
      title:
        "Do I need to open proposal to whitelisting in permissionless network?",
    },
  })[permission];

const storeCodePage = "proposal-store-code";
export const SIDEBAR_STORE_CODE_DETAILS: (
  chainName: string,
  permission: NetworkPermission
) => SidebarMetadata = (chainName, permission) =>
  ({
    permissioned: {
      description: (
        <span>
          {chainName} is permissioned chain, which means you will need to submit
          proposal to store code
          <br />
          <br />
          Another way is to get your wallet address to allow list to store code
          without opening proposal.
          <br />
          <br />
          You still can upload your Wasm to see how your code works on Testnet.
        </span>
      ),
      page: storeCodePage,
      title: "Why do I need to submit proposal?",
    },
    permissionless: {
      description: (
        <span>
          On {chainName}, you can store code without submitting a proposal by
          using{" "}
          <AppLink
            style={{ display: "inline-flex" }}
            color="primary.main"
            href="/deploy"
            onClick={() =>
              trackUseRightHelperPanel(storeCodePage, "to-/deploy")
            }
          >
            Deploy Contract
          </AppLink>
          <br />
          <br />
          However, if you&apos;re interested in exploring about the proposal
          process, you can try submitting a proposal.
          <br />
          <br />
          On the permissioned chain, submitting a proposal is required to store
          code.
        </span>
      ),
      page: storeCodePage,
      title: `Do I need to submit Proposal to store code on ${chainName}?`,
      toPage: true,
      toPagePath: "/deploy",
      toPageTitle: "Go to deploy contract",
    },
  })[permission];

export const PROPOSAL_STORE_CODE_TEXT = {
  builderError:
    "Builder should contain only alphanumerics and special characters",
  builderHelperText:
    "Builder is the docker image used to build the code deterministically for smart contract verification. Can be tagged, digested, or combination of both.",
  builderLabel: "Builder",
  builderPattern: /^[a-zA-Z0-9!@#$:;/%\\^&*)(+=._-]*$/,
  builderPlaceholder: "ex. cosmwasm/lorem-optimizer:0.1.1",
  builderRequired: "Builder is required",
  connectWallet: "You need to connect wallet to proceed this action",
  description:
    "To store your contract code, you need to submit a `StoreCodeProposal`. After the proposal passes, the code will be stored on-chain and can then be instantiated.",
  descriptionLabel: "Proposal description",
  descriptionPlaceholder:
    "Usually details information such as the team behind the contract, what the contract does, the benefits the contract will have to the chain/ecosystem, and the compiled code checksum or commit hash for the code on GitHub etc.",
  descriptionRequired: "Proposal Description is required",
  header: "Create Proposal to Store Code",
  permissionDescription:
    "If the proposal is passed, the stored code can be instantiated to a contract by your selected option",
  permissionTitle: "Instantiate permission",
  runAsHelperText: "This address will be stored as code creator.",
  runAsLabel: "Run as",
  runAsRequired: "Creator is required",
  sourceHelperText:
    "Please provide absolute or path-absolute URL (ex. https://github.com/example/url/)",
  sourceLabel: "Source",
  sourcePattern: /^(?!:)[a-zA-Z0-9+.-]+:/,
  sourcePlaceholder: "URL to the code",
  sourceRequired: "Source is required",
  titleLabel: "Proposal title",
  titlePlaceholder: "ex. Store code for ...",
  titleRequired: "Proposal Title is required",
  unpinLabel: "Unpin code",
  unpinTooltip:
    "Unpin removes the guarantee of a contract to be pinned. After calling this, the code may or may not remain in memory depending on the implementor's choice. Unpin is idempotent.",
  uploadHeader: "Upload Wasm file",
};
