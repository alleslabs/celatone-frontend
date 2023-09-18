/* eslint-disable @typescript-eslint/no-explicit-any */
import { track } from "@amplitude/analytics-browser";
import big from "big.js";
import { useCallback } from "react";

import { AmpEvent } from "../types";
import type { Token, Option } from "lib/types";

import { useMandatoryProperties } from "./useMandatoryProperties";

// TODO: implement custom event properties including section
export const useTrackInteraction = () => {
  const mandatoryProperties = useMandatoryProperties();

  const trackUseMainSearch = useCallback(
    (isClick: boolean, section?: string) =>
      track(AmpEvent.USE_MAIN_SEARCH, {
        ...mandatoryProperties,
        isClick,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseTab = useCallback(
    (tab: string, section?: string) =>
      track(AmpEvent.USE_TAB, {
        ...mandatoryProperties,
        tab,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseRadio = useCallback(
    (radio: string, section?: string) =>
      track(AmpEvent.USE_RADIO, {
        ...mandatoryProperties,
        radio,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseOtherModal = useCallback(
    (title: string, section?: string) =>
      track(AmpEvent.USE_OTHER_MODAL, {
        ...mandatoryProperties,
        title,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseViewJSON = useCallback(
    (section?: string) =>
      track(AmpEvent.USE_VIEW_JSON, {
        ...mandatoryProperties,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseUnsupportedToken = useCallback(
    (section?: string) =>
      track(AmpEvent.USE_UNSUPPORTED_ASSETS, {
        ...mandatoryProperties,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseCopier = useCallback(
    (type: string, section?: string) =>
      track(AmpEvent.USE_COPIER, {
        ...mandatoryProperties,
        type,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseExpand = useCallback(
    ({
      action,
      component,
      info,
      section,
    }: {
      action: "expand" | "collapse";
      component:
        | "assets"
        | "json"
        | "permission_address"
        | "event_box"
        | "unsupported_pool"
        | "pool_tx_msg";
      info?: object;
      section?: string;
    }) =>
      track(AmpEvent.USE_EXPAND, {
        ...mandatoryProperties,
        action,
        component,
        info,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseExpandAll = useCallback(
    (action: "expand" | "collapse", section?: string) =>
      track(AmpEvent.USE_EXPAND, {
        ...mandatoryProperties,
        action,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseClickWallet = useCallback(
    (component?: string) =>
      track(AmpEvent.USE_CLICK_WALLET, {
        ...mandatoryProperties,
        component,
      }),
    [mandatoryProperties]
  );

  const trackUseRightHelperPanel = useCallback(
    (action: string, section?: string) =>
      track(AmpEvent.USE_RIGHT_HELPER_PANEL, {
        ...mandatoryProperties,
        action,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseUnpin = useCallback(
    (check: boolean, section?: string) =>
      track(AmpEvent.USE_UNPIN, {
        ...mandatoryProperties,
        check,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseInstantiatePermission = useCallback(
    (
      type: string,
      emptyAddressesLength: number,
      addressesLength: number,
      section?: string
    ) =>
      track(AmpEvent.USE_INSTANTIATE_PERMISSION, {
        ...mandatoryProperties,
        type,
        emptyAddressesLength,
        addressesLength,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseWhitelistedAddress = useCallback(
    (
      emptyAddressesLength: number,
      filledAddressesLength: number,
      section?: string
    ) =>
      track(AmpEvent.USE_WHITELISTED_ADDRESSES, {
        ...mandatoryProperties,
        emptyAddressesLength,
        filledAddressesLength,
        section,
      }),
    [mandatoryProperties]
  );

  const trackUseDepositFill = useCallback(
    (amount: Token, section?: string) => {
      track(AmpEvent.USE_DEPOSIT_FILL, {
        ...mandatoryProperties,
        amount,
        section,
      });
    },
    [mandatoryProperties]
  );

  const trackUseSubmitProposal = useCallback(
    (
      properties: {
        initialDeposit: string;
        minDeposit: Option<string>;
        assetDenom: Option<string>;
        [key: string]: any;
      },
      section?: string
    ) => {
      const proposalPeriod = big(properties.initialDeposit).lt(
        properties.minDeposit || "0"
      )
        ? "Deposit"
        : "Voting";
      track(AmpEvent.USE_SUBMIT_PROPOSAL, {
        ...mandatoryProperties,
        ...properties,
        proposalPeriod,
        section,
      });
    },
    [mandatoryProperties]
  );

  const trackUseFilter = useCallback(
    (
      event:
        | AmpEvent.USE_FILTER_POOL_TYPE
        | AmpEvent.USE_FILTER_PROPOSALS_TYPE
        | AmpEvent.USE_FILTER_PROPOSALS_STATUS,
      filters: string[],
      action: string
    ) => track(event, { ...mandatoryProperties, action, filters }),
    [mandatoryProperties]
  );

  const trackUsePaginationNavigate = useCallback(
    (navigate: string, pageSize: number, currentPage: number) =>
      track(AmpEvent.USE_PAGINATION_NAVIGATION, {
        ...mandatoryProperties,
        navigate,
        pageSize,
        currentPage,
      }),
    [mandatoryProperties]
  );

  const trackUseSort = useCallback(
    (order: "ascending" | "descending") =>
      track(AmpEvent.USE_SORT, { ...mandatoryProperties, order }),
    [mandatoryProperties]
  );

  const trackUseView = useCallback(
    (view: string) =>
      track(AmpEvent.USE_VIEW, { ...mandatoryProperties, view }),
    [mandatoryProperties]
  );

  const trackUseToggle = useCallback(
    (name: string, isActive: boolean) =>
      track(AmpEvent.USE_TOGGLE, { ...mandatoryProperties, name, isActive }),
    [mandatoryProperties]
  );

  return {
    trackUseMainSearch,
    trackUseTab,
    trackUseRadio,
    trackUseOtherModal,
    trackUseViewJSON,
    trackUseUnsupportedToken,
    trackUseCopier,
    trackUseExpand,
    trackUseExpandAll,
    trackUseClickWallet,
    trackUseRightHelperPanel,
    trackUseUnpin,
    trackUseInstantiatePermission,
    trackUseWhitelistedAddress,
    trackUseDepositFill,
    trackUseSubmitProposal,
    trackUseFilter,
    trackUsePaginationNavigate,
    trackUseSort,
    trackUseView,
    trackUseToggle,
  };
};
