import Link from "next/link";

import type { SidebarDetails } from "lib/components/StickySidebar";
import { AmpTrackUseRightHelperPanel } from "lib/services/amplitude";

const whitelistPage = "proposal-whitelist";
export const SIDEBAR_WHITELIST_DETAILS: SidebarDetails = {
  mainnet: {
    page: whitelistPage,
    title: "What is whitelisted address?",
    description: (
      <span>
        Osmosis Mainnet is a permissioned chain, which means you will need to
        submit proposal to store code.
        <br />
        <br />
        However, there is a way to bypass this process by adding your wallet
        address or other designated addresses to an allowed list.
        <br />
        <br />
        Once your address is on this list, you will be able to store code on the
        network without having to submit a proposal every time.
      </span>
    ),
    toPage: true,
    toPagePath: "/proposal/store-code",
    toPageTitle: "Submit Proposal To Store Code",
  },
  testnet: {
    page: whitelistPage,
    title: "Do I need to open proposal to whitelisting in testnet?",
    description: (
      <span>
        The Osmosis testnet does not require whitelisting permission.
        Nonetheless, if you want to understand how the whitelisting process
        works, you can try submitting a proposal for whitelisting.
        <br />
        <br />
        On the mainnet, storing code requires a proposal to be submitted, but it
        is possible to add your wallet address or other specified addresses to
        an allowed list.
      </span>
    ),
  },
  // TODO: fill localnet information
  localnet: {
    page: whitelistPage,
    title: "",
    description: <span />,
  },
};

const storeCodePage = "proposal-store-code";
export const SIDEBAR_STORE_CODE_DETAILS: SidebarDetails = {
  mainnet: {
    page: storeCodePage,
    title: "Why do I need to submit proposal?",
    description: (
      <span>
        Osmosis Mainnet is permissioned chain, which means you will need to
        submit proposal to store code
        <br />
        <br />
        Another way is to get your wallet address to allow list to store code
        without opening proposal.
        <br />
        <br />
        You still can upload your Wasm to see how your code works on Testnet.
      </span>
    ),
    toNetwork: true,
  },
  testnet: {
    page: storeCodePage,
    title: "Do I need to submit Proposal to store code in testnet?",
    description: (
      <span>
        On the Osmosis testnet, you can store code without submitting a proposal
        by using
        <Link
          href="/deploy"
          onClick={() =>
            AmpTrackUseRightHelperPanel(storeCodePage, "to-/deploy")
          }
        >
          {" "}
          <span style={{ color: "#D8BEFC" }}>Deploy Contract</span>
        </Link>
        <br />
        <br />
        However, if you&apos;re interested in exploring about the proposal
        process, you can try submitting a proposal.
        <br />
        <br />
        On the mainnet, submitting a proposal is required to store code.
      </span>
    ),
    toPage: true,
    toPagePath: "/deploy",
    toPageTitle: "Go To Deploy Contract",
    toNetwork: true,
  },
  // TODO: fill localnet information
  localnet: {
    page: storeCodePage,
    title: "",
    description: <span />,
  },
};

export const PROPOSAL_STORE_CODE_TEXT = {
  header: "Create Proposal to Store Code",
  description:
    "To store your contract code, you need to submit a `StoreCodeProposal`. After the proposal passes, the code will bestored on-chain and can then be instantiated.",
  connectWallet: "You need to connect wallet to proceed this action",
  titlePlaceholder: "ex. Store code for ...",
  titleLabel: "Proposal Title",
  titleRequired: "Proposal Title is required",
  descriptionPlaceholder:
    "Usually details information such as the team behind the contract, what the contract does, the benefits the contract will have to the chain/ecosystem, and the compiled code checksum or commit hash for the code on GitHub etc.",
  descriptionLabel: "Proposal Description",
  descriptionRequired: "Proposal Description is required",
  runAsLabel: "Run as",
  runAsHelperText: "This address will be stored as code creator.",
  runAsRequired: "Creator is required",
  uploadHeader: "Upload Wasm File",
  codeHashHeader: "Code Hash",
  unpinLabel: "Unpin code",
  unpinTooltip:
    "Unpin removes the guarantee of a contract to be pinned. After calling this, the code may or may not remain in memory depending on the implementor's choice. Unpin is idempotent.",
  builderPlaceholder: "ex. cosmwasm/lorem-optimizer:0.1.1",
  builderLabel: "Builder",
  builderRequired: "Builder is required",
  sourcePlaceholder: "URL to the code",
  sourceLabel: "Source",
  sourceRequired: "Source is required",
  sourceHelperText:
    "Please provide absolute or path-absolute URL (ex. https://github.com/example/url/)",
  permissionTitle: "Instantiate Permission",
  permissionDescription:
    "If the proposal is passed, the stored code can be instantiated to a contract by your selected option",
};
