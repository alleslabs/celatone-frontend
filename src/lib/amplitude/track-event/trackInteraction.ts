import type { SearchResultType } from "lib/services/searchService";
import type { Addr, Option, Token } from "lib/types";

import { big } from "lib/types";
import { isHexModuleAddress, isHexWalletAddress } from "lib/utils";

import { amp } from "../Amplitude";
import { AmpEvent } from "../types";

export const trackUseMainSearch = (
  isClick: boolean,
  type?: SearchResultType,
  section?: string
) =>
  amp.track(AmpEvent.USE_MAIN_SEARCH, {
    isClick,
    section,
    type,
  });

export const trackUseTab = (tab: string, section?: string, info?: string) =>
  amp.track(AmpEvent.USE_TAB, {
    info,
    section,
    tab,
  });

export const trackUseViewMore = (properties?: { [key: string]: string }) =>
  amp.track(AmpEvent.USE_VIEW_MORE, properties);

export const trackUseUpTime = (properties?: { [key: string]: string }) =>
  amp.track(AmpEvent.USE_UPTIME, properties);

export const trackSearchInput = (properties?: { [key: string]: string }) =>
  amp.track(AmpEvent.USE_SEARCH_INPUT, properties);

export const trackUseRadio = (radio: string, section?: string) =>
  amp.track(AmpEvent.USE_RADIO, {
    radio,
    section,
  });

export const trackUseOtherModal = (title: string, section?: string) =>
  amp.track(AmpEvent.USE_OTHER_MODAL, {
    section,
    title,
  });

export const trackUseViewJSON = (section?: string) =>
  amp.track(AmpEvent.USE_VIEW_JSON, {
    section,
  });

export const trackUseUnsupportedToken = (section?: string) =>
  amp.track(AmpEvent.USE_UNSUPPORTED_ASSETS, {
    section,
  });

export const trackUseCopier = (
  type: string,
  section?: string,
  subSection?: string,
  info?: string
) =>
  amp.track(AmpEvent.USE_COPIER, {
    info,
    section,
    subSection,
    type,
  });

export const trackUseExpand = ({
  action,
  component,
  info,
  section,
}: {
  action: "collapse" | "expand";
  component:
    | "assets"
    | "event_box"
    | "json"
    | "module_function_accordion"
    | "module_interaction_function_accordion"
    | "module_interaction_selected_function_card"
    | "module_struct_accordion"
    | "permission_address"
    | "pool_tx_msg"
    | "proposal_message_card"
    | "resources_by_account_card"
    | "resources_detail_card"
    | "unsupported_pool";
  info?: object;
  section?: string;
}) =>
  amp.track(AmpEvent.USE_EXPAND, {
    action,
    component,
    info,
    section,
  });

export const trackUseExpandAll = (
  action: "collapse" | "expand",
  section?: string
) =>
  amp.track(AmpEvent.USE_EXPAND_ALL, {
    action,
    section,
  });

export const trackUseClickWallet = (component?: string) =>
  amp.track(AmpEvent.USE_CLICK_WALLET, {
    component,
  });

export const trackUseRightHelperPanel = (action: string, section?: string) =>
  amp.track(AmpEvent.USE_RIGHT_HELPER_PANEL, {
    action,
    section,
  });

export const trackUseUnpin = (check: boolean, section?: string) =>
  amp.track(AmpEvent.USE_UNPIN, {
    check,
    section,
  });

export const trackUseInstantiatePermission = (
  type: string,
  emptyAddressesLength: number,
  addressesLength: number,
  section?: string
) =>
  amp.track(AmpEvent.USE_INSTANTIATE_PERMISSION, {
    addressesLength,
    emptyAddressesLength,
    section,
    type,
  });

export const trackUseWhitelistedAddress = (
  emptyAddressesLength: number,
  filledAddressesLength: number,
  section?: string
) =>
  amp.track(AmpEvent.USE_WHITELISTED_ADDRESSES, {
    emptyAddressesLength,
    filledAddressesLength,
    section,
  });

export const trackUseDepositFill = (amount: Token, section?: string) =>
  amp.track(AmpEvent.USE_DEPOSIT_FILL, {
    amount,
    section,
  });

export const trackUseSubmitProposal = (
  properties: {
    [key: string]: unknown;
    assetDenom: Option<string>;
    initialDeposit: string;
    minDeposit: Option<string>;
  },
  section?: string
) => {
  const proposalPeriod = big(properties.initialDeposit).lt(
    properties.minDeposit || "0"
  )
    ? "Deposit"
    : "Voting";

  amp.track(AmpEvent.USE_SUBMIT_PROPOSAL, {
    ...properties,
    proposalPeriod,
    section,
  });
};

export const trackUseFilter = (
  event:
    | AmpEvent.USE_FILTER_POOL_TYPE
    | AmpEvent.USE_FILTER_PROPOSALS_STATUS
    | AmpEvent.USE_FILTER_PROPOSALS_TYPE
    | AmpEvent.USE_FILTER_VALIDATORS_ACTIVE
    | AmpEvent.USE_FILTER_VOTED_PROPOSALS_ANSWER,
  filters: string[],
  action: string
) => amp.track(event, { action, filters });

export const trackUsePaginationNavigate = (
  navigate: string,
  pageSize: number,
  currentPage: number
) =>
  amp.track(AmpEvent.USE_PAGINATION_NAVIGATION, {
    currentPage,
    navigate,
    pageSize,
  });

export const trackUseSort = (
  sortBy: string,
  order: "ascending" | "descending"
) => amp.track(AmpEvent.USE_SORT, { order, sortBy });

export const trackUseView = (view: string) =>
  amp.track(AmpEvent.USE_VIEW, { view });

export const trackUseToggle = (name: string, isActive: boolean) =>
  amp.track(AmpEvent.USE_TOGGLE, { isActive, name });

export const trackUseModuleSelectionInputFill = (
  address: Addr,
  manualModuleName: boolean,
  manualFunctionName: boolean
) =>
  amp.track(AmpEvent.USE_MODULE_SELECTION_INPUT_FILL, {
    address: !!address,
    isHex: isHexWalletAddress(address) || isHexModuleAddress(address),
    manualFunctionName,
    manualModuleName,
  });
