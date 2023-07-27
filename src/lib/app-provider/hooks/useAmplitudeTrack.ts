import { track } from "@amplitude/analytics-browser";
import big from "big.js";
import { createHash } from "crypto";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { useCelatoneApp } from "../contexts";
import { AmpEvent } from "lib/types";
import type {
  Dict,
  Token,
  Option,
  ActionAmpEvent,
  SpecialAmpEvent,
} from "lib/types";

import { useCurrentChain } from "./useCurrentChain";
import { useMobile } from "./useMediaQuery";

export const useAmplitudeTrack = () => {
  const { isExpand, isDevMode, currentChainId, prevPathname } =
    useCelatoneApp();
  const { address } = useCurrentChain();
  const isMobile = useMobile();
  const router = useRouter();

  const walletAddress = address
    ? createHash("sha256").update(address).digest("hex")
    : "Not Connected";

  const mandatoryEvents = useMemo(
    () => ({
      page: router.pathname.replace("/[network]", ""),
      prevPathname,
      walletAddress,
      chain: currentChainId,
      mobile: isMobile,
      navOpen: isExpand,
      devMode: isDevMode,
    }),
    [
      currentChainId,
      isDevMode,
      isExpand,
      isMobile,
      prevPathname,
      router.pathname,
      walletAddress,
    ]
  );

  // General track
  const ampTrack = useCallback(
    (
      event: Exclude<AmpEvent, ActionAmpEvent | SpecialAmpEvent>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties?: Record<string, any>
    ) => {
      track(event, {
        ...mandatoryEvents,
        ...properties,
      });
    },
    [mandatoryEvents]
  );

  // To query
  const ampTrackToQuery = useCallback(
    (contract: boolean, msg: boolean, fromPage?: string, section?: string) => {
      track(AmpEvent.TO_QUERY, {
        ...mandatoryEvents,
        contract,
        msg,
        fromPage,
        section,
      });
    },
    [mandatoryEvents]
  );

  // To execute
  const ampTrackToExecute = useCallback(
    (contract: boolean, msg: boolean, fromPage?: string, section?: string) => {
      track(AmpEvent.TO_EXECUTE, {
        ...mandatoryEvents,
        contract,
        msg,
        fromPage,
        section,
      });
    },
    [mandatoryEvents]
  );

  // To instantiate
  const ampTrackToInstantiate = useCallback(
    (msg: boolean, codeId: boolean, section?: string) => {
      track(AmpEvent.TO_INSTANTIATE, {
        ...mandatoryEvents,
        codeId,
        msg,
        section,
      });
    },
    [mandatoryEvents]
  );

  // To migrate
  const ampTrackToMigrate = useCallback(
    (contract: boolean, codeId: boolean, section?: string) => {
      track(AmpEvent.TO_MIGRATE, {
        ...mandatoryEvents,
        codeId,
        contract,
        section,
      });
    },
    [mandatoryEvents]
  );

  // To admin update
  const ampTrackToAdminUpdate = useCallback(
    (contract: boolean, section?: string) => {
      track(AmpEvent.TO_ADMIN_UPDATE, {
        ...mandatoryEvents,
        contract,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use main search
  const ampTrackUseMainSearch = useCallback(
    (isClick: boolean, section?: string) => {
      track(AmpEvent.USE_MAIN_SEARCH, {
        ...mandatoryEvents,
        isClick,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use tab
  const ampTrackUseTab = useCallback(
    (tab: string, section?: string) => {
      track(AmpEvent.USE_TAB, {
        ...mandatoryEvents,
        tab,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use radio
  const ampTrackUseRadio = useCallback(
    (radio: string, section?: string) => {
      track(AmpEvent.USE_RADIO, {
        ...mandatoryEvents,
        radio,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use other modal
  const ampTrackUseOtherModal = useCallback(
    (title: string, section?: string) => {
      track(AmpEvent.USE_OTHER_MODAL, {
        ...mandatoryEvents,
        title,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Track to mintscan
  const ampTrackMintscan = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (type: string, properties?: Dict<string, any>, section?: string) => {
      track(AmpEvent.MINTSCAN, {
        ...mandatoryEvents,
        type,
        properties,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Track to website
  const ampTrackWebsite = useCallback(
    (url: string, section?: string) => {
      track(AmpEvent.WEBSITE, {
        ...mandatoryEvents,
        url,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Track to social
  const ampTrackSocial = useCallback(
    (url: string, section?: string) => {
      track(AmpEvent.SOCIAL, {
        ...mandatoryEvents,
        url,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Track to celatone
  const ampTrackCelatone = useCallback(
    (url: string, section?: string) => {
      track(AmpEvent.CELATONE, {
        ...mandatoryEvents,
        url,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Track to view JSON
  const ampTrackViewJson = useCallback(
    (section?: string) => {
      track(AmpEvent.USE_VIEW_JSON, {
        ...mandatoryEvents,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Track to view JSON
  const ampTrackUnsupportedToken = useCallback(
    (section?: string) => {
      track(AmpEvent.USE_UNSUPPORTED_ASSETS, {
        ...mandatoryEvents,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Track copier
  const ampTrackCopier = useCallback(
    (type: string, section?: string) => {
      track(AmpEvent.USE_COPIER, {
        ...mandatoryEvents,
        type,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Track expand
  const ampTrackExpand = useCallback(
    (
      action: "expand" | "collapse",
      component:
        | "assets"
        | "json"
        | "permission_address"
        | "event_box"
        | "unsupported_pool"
        | "pool_tx_msg",
      info?: object,
      section?: string
    ) => {
      track(AmpEvent.USE_EXPAND, {
        ...mandatoryEvents,
        action,
        component,
        info,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Track expand all
  const ampTrackExpandAll = useCallback(
    (action: "expand" | "collapse", section?: string) => {
      track(AmpEvent.USE_EXPAND, {
        ...mandatoryEvents,
        action,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use click wallet
  const ampTrackUseClickWallet = useCallback(
    (component?: string, section?: string) => {
      track(AmpEvent.USE_CLICK_WALLET, {
        ...mandatoryEvents,
        component,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use right helper panel
  const ampTrackUseRightHelperPanel = useCallback(
    (action: string, section?: string) => {
      track(AmpEvent.USE_RIGHT_HELPER_PANEL, {
        ...mandatoryEvents,
        action,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use unpin
  const ampTrackUseUnpin = useCallback(
    (check: boolean, section?: string) => {
      track(AmpEvent.USE_UNPIN, {
        ...mandatoryEvents,
        check,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use instantiate permission
  const ampTrackUseInstantiatePermission = useCallback(
    (
      type: string,
      emptyAddressesLength: number,
      addressesLength: number,
      section?: string
    ) => {
      track(AmpEvent.USE_INSTANTIATE_PERMISSION, {
        ...mandatoryEvents,
        type,
        emptyAddressesLength,
        addressesLength,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use whitelist addresses
  const ampTrackUseWhitelistedAddress = useCallback(
    (
      emptyAddressesLength: number,
      filledAddressesLength: number,
      section?: string
    ) => {
      track(AmpEvent.USE_WHITELISTED_ADDRESSES, {
        ...mandatoryEvents,
        emptyAddressesLength,
        filledAddressesLength,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use deposite fill
  const ampTrackUseDepositFill = useCallback(
    (amount: Token, section?: string) => {
      track(AmpEvent.USE_DEPOSIT_FILL, {
        ...mandatoryEvents,
        amount,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use submit proposal
  const ampTrackUseSubmitProposal = useCallback(
    (
      properties: {
        initialDeposit: string;
        minDeposit: Option<string>;
        assetDenom: Option<string>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        ...mandatoryEvents,
        ...properties,
        proposalPeriod,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use filter
  const ampTrackUseFilter = useCallback(
    (
      ampEvent: AmpEvent,
      filters: string[],
      action: string,
      section?: string
    ) => {
      track(ampEvent, {
        ...mandatoryEvents,
        filters,
        action,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use pagination navigation
  const ampTrackPaginationNavigate = useCallback(
    (
      navigate: string,
      pageSize: number,
      currentPage: number,
      section?: string
    ) => {
      track(AmpEvent.USE_PAGINATION_NAVIGATION, {
        ...mandatoryEvents,
        navigate,
        pageSize,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use sort
  const ampTrackUseSort = useCallback(
    (order: "ascending" | "descending", section?: string) => {
      track(AmpEvent.USE_SORT, {
        ...mandatoryEvents,
        order,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use view
  const ampTrackUseView = useCallback(
    (view: string, section?: string) => {
      track(AmpEvent.USE_VIEW, {
        ...mandatoryEvents,
        view,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use toggle
  const ampTrackUseToggle = useCallback(
    (name: string, isActive: boolean, section?: string) => {
      track(AmpEvent.USE_TOGGLE, {
        ...mandatoryEvents,
        name,
        isActive,
        section,
      });
    },
    [mandatoryEvents]
  );

  // Use alert CTA
  const ampTrackUseAlertCTA = useCallback(
    (action: string, section?: string) => {
      track(AmpEvent.USE_ALERT_CTA, {
        ...mandatoryEvents,
        action,
        section,
      });
    },
    [mandatoryEvents]
  );

  return {
    ampTrack,
    ampTrackToQuery,
    ampTrackToExecute,
    ampTrackToInstantiate,
    ampTrackToMigrate,
    ampTrackToAdminUpdate,
    ampTrackUseMainSearch,
    ampTrackUseTab,
    ampTrackUseRadio,
    ampTrackUseOtherModal,
    ampTrackMintscan,
    ampTrackWebsite,
    ampTrackSocial,
    ampTrackCelatone,
    ampTrackViewJson,
    ampTrackUnsupportedToken,
    ampTrackCopier,
    ampTrackExpand,
    ampTrackExpandAll,
    ampTrackUseClickWallet,
    ampTrackUseRightHelperPanel,
    ampTrackUseUnpin,
    ampTrackUseInstantiatePermission,
    ampTrackUseWhitelistedAddress,
    ampTrackUseDepositFill,
    ampTrackUseSubmitProposal,
    ampTrackUseFilter,
    ampTrackPaginationNavigate,
    ampTrackUseSort,
    ampTrackUseView,
    ampTrackUseToggle,
    ampTrackUseAlertCTA,
  };
};
