const BREAK_POINT_MD = 1280;
const BREAK_POINT_LG = 1920;

const getScreenSize = () => {
  const width = window.innerWidth;
  if (width <= BREAK_POINT_MD) {
    return "sm";
  } else if (width <= BREAK_POINT_LG) {
    return "md";
  } else {
    return "lg";
  }
};

function isSm() {
  return getScreenSize() === "sm";
}

function createCheckIcon(size, color) {
  const checkIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  checkIcon.className.baseVal = `check-icon ${size} ${color}`;
  checkIcon.setAttribute("viewBox", "0 0 16 16");
  const checkPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  checkPath.setAttribute(
    "d",
    "m1.633 8.707 1.414-1.414 3.182 3.182 6.718-6.718 1.414 1.415-8.132 8.131z"
  );
  checkIcon.appendChild(checkPath);
  return checkIcon;
}

///////////////////////////////////////////////////////////////////////////////
//
//                            MARK: APP MENU
//
///////////////////////////////////////////////////////////////////////////////

const APP_LIST = [
  {
    name: "app",
    logo: "https://assets.initia.xyz/images/dapps/app/logo.webp",
    link: "https://app.testnet.initia.xyz/",
  },
  {
    name: "scan",
    logo: "https://assets.initia.xyz/images/dapps/scan/logo.webp",
    link: "https://scan.testnet.initia.xyz/",
  },
  {
    name: "usernames",
    logo: "https://assets.initia.xyz/images/dapps/usernames/logo.webp",
    link: "https://usernames.testnet.initia.xyz/",
  },
  {
    name: "bridge",
    logo: "https://assets.initia.xyz/images/dapps/bridge/logo.webp",
    link: "https://bridge.testnet.initia.xyz/",
  },
  {
    name: "faucet",
    logo: "https://assets.initia.xyz/images/dapps/faucet/logo.webp",
    link: "https://faucet.testnet.initia.xyz/",
  },
];

function createAppMenuTrigger() {
  const appMenuTrigger = document.createElement("div");
  appMenuTrigger.className = "app-menu-trigger";

  const iconContainer = document.createElement("div");
  iconContainer.className = "icon-container";

  const appMenuIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  appMenuIcon.className.baseVal = "app-menu-icon";
  appMenuIcon.setAttribute("viewBox", "0 0 16 16");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M3.333 3.333h3.333v3.333H3.333zM3.333 9.333h3.333v3.333H3.333zM9.333 3.333h3.333v3.333H9.333zM9.333 9.333h3.333v3.333H9.333z"
  );
  path.setAttribute("fill", "currentColor");
  appMenuIcon.appendChild(path);

  iconContainer.appendChild(appMenuIcon);
  appMenuTrigger.appendChild(iconContainer);

  return appMenuTrigger;
}

function createAppMenuList(currentApp, size) {
  const appListContainer = document.createElement("div");
  appListContainer.className = "app-list";

  APP_LIST.forEach((app) => {
    const appLogo = document.createElement("img");
    appLogo.className = "app-logo";
    appLogo.src = app.logo;
    appLogo.alt = app.name;

    if (app.name === currentApp) {
      const appItem = document.createElement("div");
      appItem.className = `app-item ${size} current`;
      appItem.appendChild(appLogo);
      appItem.appendChild(createCheckIcon(size, "white"));

      appListContainer.appendChild(appItem);
    } else {
      const appLink = document.createElement("a");
      appLink.className = `app-item ${size} link`;
      appLink.href = app.link;
      appLink.target = "_blank";
      appLink.rel = "noopener noreferrer";
      appLink.appendChild(appLogo);

      appListContainer.appendChild(appLink);
    }
  });

  return appListContainer;
}

function injectAppMenu() {
  const appMenuContainer = document.getElementById("app-menu");
  const currentApp = appMenuContainer.getAttribute("data-app");

  const appMenuTrigger = createAppMenuTrigger();
  appMenuContainer.appendChild(appMenuTrigger);

  // APP MENU POPOVER (FOR DESKTOP)
  const appMenuPopover = document.createElement("div");
  appMenuPopover.className = "app-menu-popover";
  appMenuPopover.appendChild(createAppMenuList(currentApp, "sm"));

  const updateAppMenuPopoverPosition = () => {
    const triggerRect = appMenuTrigger.getBoundingClientRect();
    appMenuPopover.style.top = `${triggerRect.bottom - 10}px`;
    appMenuPopover.style.left = `${triggerRect.left + 10}px`;
  };

  let popoverTimeoutId;
  appMenuTrigger.addEventListener("mouseover", function () {
    if (!isSm() && !appMenuPopover.classList.contains("show-app-menu")) {
      if (document.body.contains(appMenuPopover))
        clearTimeout(popoverTimeoutId);
      else document.body.appendChild(appMenuPopover);

      updateAppMenuPopoverPosition();
      setTimeout(() => {
        appMenuPopover.classList.add("show-app-menu");
      }, 10);
    }
  });
  document.addEventListener("mousemove", function (event) {
    if (
      !isSm() &&
      appMenuPopover.classList.contains("show-app-menu") &&
      !appMenuTrigger.contains(event.target) &&
      !appMenuPopover.contains(event.target)
    ) {
      appMenuPopover.classList.remove("show-app-menu");
      popoverTimeoutId = setTimeout(() => {
        document.body.removeChild(appMenuPopover);
      }, 200);
    }
  });
  window.addEventListener("resize", () => {
    if (document.body.contains(appMenuPopover)) {
      updateAppMenuPopoverPosition();
    }
  });

  // APP MENU DRAWER (FOR MOBILE)
  const appMenuDrawer = document.createElement("div");
  appMenuDrawer.className = "app-menu-drawer";
  const appMenuDrawerContent = document.createElement("div");
  appMenuDrawerContent.className = "app-menu-drawer-content";
  appMenuDrawerContent.appendChild(createAppMenuList(currentApp, "md"));
  appMenuDrawer.appendChild(appMenuDrawerContent);

  let drawerTimeoutId;
  appMenuTrigger.addEventListener("click", function () {
    if (isSm() && !appMenuDrawer.classList.contains("show-app-menu")) {
      if (document.body.contains(appMenuDrawer)) clearTimeout(drawerTimeoutId);
      else document.body.appendChild(appMenuDrawer);
      setTimeout(() => {
        appMenuDrawer.classList.add("show-app-menu");
      }, 10);
    }
  });
  appMenuDrawer.addEventListener("click", function (event) {
    if (
      isSm() &&
      appMenuDrawer.classList.contains("show-app-menu") &&
      !appMenuDrawerContent.contains(event.target)
    ) {
      appMenuDrawer.classList.remove("show-app-menu");
      drawerTimeoutId = setTimeout(() => {
        document.body.removeChild(appMenuDrawer);
      }, 200);
    }
  });
  appMenuDrawer.addEventListener("keydown", function (event) {
    if (
      isSm() &&
      appMenuDrawer.classList.contains("show-app-menu") &&
      event.key === "Escape"
    ) {
      appMenuDrawer.classList.remove("show-app-menu");
      drawerTimeoutId = setTimeout(() => {
        document.body.removeChild(appMenuDrawer);
      }, 200);
    }
  });

  window.addEventListener("resize", () => {
    if (!document.body.contains(appMenuTrigger)) {
      const appMenuContainer = document.getElementById("app-menu");
      appMenuContainer.appendChild(appMenuTrigger);
    }

    if (isSm() && document.body.contains(appMenuPopover)) {
      appMenuPopover.classList.remove("show-app-menu");
      document.body.removeChild(appMenuPopover);
    }

    if (!isSm() && document.body.contains(appMenuDrawer)) {
      appMenuDrawer.classList.remove("show-app-menu");
      document.body.removeChild(appMenuDrawer);
    }
  });
}

///////////////////////////////////////////////////////////////////////////////
//
//                  MARK: TERMS OF USE AND PRIVACY POLICY
//
///////////////////////////////////////////////////////////////////////////////

const INITIA_DOMAIN = ".initia.xyz";
const COOKIE_NAME = "accept_initia_terms_v1";

const LANDING_TAG = `<a href="https://initia.xyz" target="_blank">https://initia.xyz</a>`;
const TERMS_OF_USE_TAG = `<a href="https://initia.xyz/terms-of-use" target="_blank">Terms of Use</a>`;
const PRIVACY_POLICY_TAG = `<a href="https://initia.xyz/privacy-policy" target="_blank">Privacy Policy</a>`;
const COOKIE_POLICY_TAG = `<a href="https://initia.xyz/cookie-policy" target="_blank">Cookie Policy</a>`;
const INITIA_TERMS = [
  [
    "",
    `By clicking the "Accept" button below, and accessing and using the Initia Platform and Services available through ${LANDING_TAG} and the subdomains associated with ${LANDING_TAG}, you acknowledge and agree to the following:`,
  ],
  [
    "Applicable Terms and Conditions",
    `Your access and use of the Platform and the Services is governed by and subject to the ${TERMS_OF_USE_TAG}, the ${PRIVACY_POLICY_TAG}, and the ${COOKIE_POLICY_TAG}. You hereby acknowledge and confirm that you have read and understood the Terms of Use, the Privacy Policy, and the Cookie Policy, and that you agree to be bound by such terms in respect of your access and use of the Initia Platform and Services.`,
  ],
  [
    "Jurisdictional Limitations",
    `The Platform and the Services are subject to applicable laws and regulations and may not be available to residents of certain jurisdictions. You may not access or use the Platform or the Services if you are a Prohibited Person (as defined in the Terms of Use) or if the access or use of the Platform or the Services would be in contravention or violation of any applicable laws or regulations. You hereby acknowledge, represent, warrant and agree that you are not a Prohibited Person, and that your access and use of the Platform and the Services do not contravene or violate any applicable laws or regulations.`,
  ],
  [
    "Privacy and Data Usage",
    `We may collect certain information when you access and use the Platform and the Services, such as your wallet addresses, your email address and/or your past interactions with Initia. For more information on how your data may be collected, used, disclosed and/or processed, please refer to our ${PRIVACY_POLICY_TAG}. You hereby consent to the collection, usage, disclosure and processing of information relating to you, including without limitation, your personal data, in accordance with our Privacy Policy.`,
  ],
  [
    "User Responsibility and Security",
    `Please note that it is your responsibility to ensure the security of your wallets, private keys, and other credentials when using the Platform and the Services. We will never request your private keys, wallet seed phrases, or sensitive account information.`,
  ],
  [
    "Third Party Services",
    `Certain parts of the Platform and the Services may be provided by third parties, and may be subject to the terms and conditions and privacy policies of such third parties. It is your sole responsibility to check the terms and conditions, and privacy policies applicable to such third party services. Initia has no control or responsibility over such third party services, and will not be liable or responsible for any loss, expenses, damage, injury or costs suffered or incurred by you in the course of your access and use of such third party services.`,
  ],
  [
    "Assumption of Risk",
    `The Platform and the Services are on an “as is” and “under development” without warranties, express or implied, regarding accuracy, completeness, security, or fitness for a particular purpose. You access and use the Platform and the Services at your sole risk, and we will not be liable or responsible for any loss, expenses, damage, injury or costs suffered or incurred by you in the course of your access and use of the Platform and the Services.`,
  ],
  [
    "",
    `※ If you do not accept any of these terms, you may not proceed with accessing or using the Initia Platform and Services.`,
  ],
];

function getCurrentDomain() {
  if (location.hostname.endsWith(INITIA_DOMAIN)) return INITIA_DOMAIN;
  if (location.hostname.endsWith(".vercel.app")) return ".vercel.app";
  return location.hostname;
}

function hasTermsCookie() {
  const cookies = document.cookie.split(";");
  return cookies.some((cookie) => {
    const [k, v] = cookie.trim().split("=");
    if (k === COOKIE_NAME && v === "true") return true;
  });
}

function addTermsCookie() {
  const assign = COOKIE_NAME + "=" + "true" + ";";
  const maxAge = "max-age=" + "34560000" + ";"; // 400 days chrome limit
  const path = "path=/;";
  const domain = "domain=" + getCurrentDomain() + ";";
  document.cookie = assign + maxAge + path + domain;
}

function createTermsHeader() {
  const termsHeader = document.createElement("p");
  termsHeader.className = "terms-header";
  termsHeader.innerHTML = "Important Disclaimers And Acknowledgement of Terms";

  return termsHeader;
}

function createTermsDescription() {
  const termsDescription = document.createElement("div");
  termsDescription.className = "terms-description";
  const infoIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  infoIcon.className.baseVal = "info-icon";
  infoIcon.setAttribute("viewBox", "0 0 16 16");
  const infoPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  infoPath.setAttribute(
    "d",
    "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.75-11.75v1.5h-1.5v-1.5zm0 2.5v5h-1.5v-5z"
  );
  infoPath.setAttribute("fill", "currentColor");
  infoIcon.appendChild(infoPath);
  termsDescription.appendChild(infoIcon);

  const termsDescriptionText = document.createElement("p");
  termsDescriptionText.className = "terms-description-text";
  termsDescriptionText.innerHTML =
    "Please Read Carefully Before Accessing and Using the Initia Platform and Services";
  termsDescription.appendChild(termsDescriptionText);

  return termsDescription;
}

function createTermsBody() {
  const termsBody = document.createElement("div");
  termsBody.className = "terms-body";
  for (const [k, v] of INITIA_TERMS) {
    if (k.length) {
      const termsBodyParagraph = document.createElement("p");
      termsBodyParagraph.className = "terms-body-topic";
      termsBodyParagraph.innerHTML = k;
      termsBody.appendChild(termsBodyParagraph);
    }

    const termsBodyParagraph = document.createElement("p");
    termsBodyParagraph.innerHTML = v;
    termsBody.appendChild(termsBodyParagraph);
  }
  return termsBody;
}

function createTermsFooter(handleOnAccept) {
  const termsFooter = document.createElement("div");
  termsFooter.className = "terms-footer";

  const termsCheckbox = document.createElement("div");
  termsCheckbox.className = "terms-checkbox";
  const termsCheckboxInput = document.createElement("div");
  termsCheckboxInput.className = "terms-checkbox-box";
  termsCheckboxInput.appendChild(createCheckIcon("xs", "dark"));
  termsCheckbox.appendChild(termsCheckboxInput);
  const termsCheckboxLabel = document.createElement("label");
  termsCheckboxLabel.className = "terms-checkbox-label";
  termsCheckboxLabel.innerHTML =
    "I have read the above and do not need to be shown this disclaimer again in the future.";
  termsCheckbox.appendChild(termsCheckboxLabel);

  termsCheckbox.onclick = function () {
    termsFooter.classList.toggle("checked");
  };

  termsFooter.appendChild(termsCheckbox);

  const termsAcceptButton = document.createElement("button");
  termsAcceptButton.className = "terms-accept-button";
  termsAcceptButton.innerHTML = "Accept";
  termsAcceptButton.onclick = function () {
    if (!termsFooter.classList.contains("checked")) return;
    handleOnAccept();
  };
  termsFooter.appendChild(termsAcceptButton);

  return termsFooter;
}

function injectTermsOfService() {
  const isAccepted = hasTermsCookie();
  if (isAccepted) return;

  const initiaTerms = document.createElement("div");
  initiaTerms.className = "initia-terms";
  initiaTerms.setAttribute("data-screen-size", getScreenSize());

  const termsContainer = document.createElement("div");
  termsContainer.className = "terms-container";

  termsContainer.appendChild(createTermsHeader());
  termsContainer.appendChild(createTermsDescription());
  termsContainer.appendChild(createTermsBody());
  termsContainer.appendChild(
    createTermsFooter(function () {
      addTermsCookie();

      initiaTerms.classList.add("accepted");
      setTimeout(() => {
        document.body.removeChild(initiaTerms);
      }, 200);
    })
  );
  initiaTerms.appendChild(termsContainer);

  document.body.appendChild(initiaTerms);

  window.addEventListener("resize", () => {
    const size = getScreenSize();
    if (size !== initiaTerms.getAttribute("data-screen-size")) {
      initiaTerms.setAttribute("data-screen-size", size);
    }
  });
}

///////////////////////////////////////////////////////////////////////////////
//
//                            MARK: MAIN
//
///////////////////////////////////////////////////////////////////////////////

(function () {
  injectAppMenu();
  injectTermsOfService();
})();
