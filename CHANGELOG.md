<!--
Guiding Principles:

Changelogs are for humans, not machines.
There should be an entry for every single version.
The same types of changes should be grouped.
Versions and sections should be linkable.
The latest version comes first.
The release date of each version is displayed.
Mention whether you follow Semantic Versioning.

Usage:

Change log entries are to be added to the Unreleased section under the
appropriate stanza (see below). Each entry should ideally include a tag and
the Github issue reference in the following format:

* (<tag>) \#<issue-number> message

The issue numbers will later be link-ified during the release process so you do
not have to worry about including a link manually, but you can if you wish.

Types of changes:

"Features" for new features.
"Improvements" for changes in existing functionality.
"Bug Fixes" for any bug fixes.
Ref: https://keepachangelog.com/en/1.0.0/
-->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Features

- [#224](https://github.com/alleslabs/celatone-frontend/pull/224) Support search by tx and internal tx link
- [#226](https://github.com/alleslabs/celatone-frontend/pull/226) Add fully functional transaction details page
- [#79](https://github.com/alleslabs/celatone-frontend/pull/79) Add dropdown menu and wireup up json attach funds
- [#225](https://github.com/alleslabs/celatone-frontend/pull/225) Add assets section in account details page
- [#220](https://github.com/alleslabs/celatone-frontend/pull/220) Add transactions table for account details page
- [#222](https://github.com/alleslabs/celatone-frontend/pull/222) Add proposals of an account
- [#221](https://github.com/alleslabs/celatone-frontend/pull/221) Add codes of an account
- [#223](https://github.com/alleslabs/celatone-frontend/pull/223) Newer version of token card and format mechanism
- [#214](https://github.com/alleslabs/celatone-frontend/pull/214) Show code permission helper text in save new code modal
- [#218](https://github.com/alleslabs/celatone-frontend/pull/218) Add instantiated and admin contracts of an account
- [#192](https://github.com/alleslabs/celatone-frontend/pull/192) Add alternative sidebar with only icons
- [#210](https://github.com/alleslabs/celatone-frontend/pull/210) New design for token card, currently support price
- [#189](https://github.com/alleslabs/celatone-frontend/pull/189) Add skeleton for the account details page
- [#193](https://github.com/alleslabs/celatone-frontend/pull/193) Get data for account details page

### Improvements

- [#207](https://github.com/alleslabs/celatone-frontend/pull/207) Add cta to submit public project in list page
- [#206](https://github.com/alleslabs/celatone-frontend/pull/206) Refactor copy functionality into one component

### Bug fixes

- [#219](https://github.com/alleslabs/celatone-frontend/pull/219) Fix asset value and price formatter
- [#217](https://github.com/alleslabs/celatone-frontend/pull/217) Fix state reset in Save New Code modal and no permission in migration

## v1.0.1

### Bug fixes

- [#195](https://github.com/alleslabs/celatone-frontend/pull/195) Make code name cell for migration table to be editable in contract detail page
- [#213](https://github.com/alleslabs/celatone-frontend/pull/213) Fix `window.crypto.randomUUID()` in old safari version (< 15.4) and `at()` of array

## v1.0.0

### Features

- [#199](https://github.com/alleslabs/celatone-frontend/pull/199) Final prelaunch cleanup
- [#202](https://github.com/alleslabs/celatone-frontend/pull/202) Reorder absolute and relative timestmap in stored block height
- [#201](https://github.com/alleslabs/celatone-frontend/pull/201) Add GPLv3 license
- [#170](https://github.com/alleslabs/celatone-frontend/pull/170) Add Google Analytics 4 for website analytics
- [#169](https://github.com/alleslabs/celatone-frontend/pull/169) Add amplitude for website analytics
- [#133](https://github.com/alleslabs/celatone-frontend/pull/133) Add OG and default SEO with next-seo
- [#160](https://github.com/alleslabs/celaotne-frontend/pull/160) Add remaining public codes and contracts info
- [#162](https://github.com/alleslabs/celatone-frontend/pull/162) Add sentry.io for error logging and stack tracing
- [#178](https://github.com/alleslabs/celatone-frontend/pull/178) Add close modal button when update admin succeed and reset states on close
- [#167](https://github.com/alleslabs/celatone-frontend/pull/167) Show public projects only on mainnet networks and change all codes to recent codes
- [#152](https://github.com/alleslabs/celatone-frontend/pull/152) Change default network to mainnet and refactor logic
- [#150](https://github.com/alleslabs/celatone-frontend/pull/150) Add Osmosis mainnet GraphQl, LCD, RPC
- [#149](https://github.com/alleslabs/celatone-frontend/pull/149) Apply new branding
- [#93](https://github.com/alleslabs/celatone-frontend/pull/93) Add filter code by instantiate permission in all codes page
- [#141](https://github.com/alleslabs/celatone-frontend/pull/141) Add 404 not found page, catch network params error
- [#134](https://github.com/alleslabs/celatone-frontend/pull/134) Fix un-align sub-page with sidebar
- [#144](https://github.com/alleslabs/celatone-frontend/pull/144) Add `Assign me` for admin address on instantiate form
- [#131](https://github.com/alleslabs/celatone-frontend/pull/131) Add CW2-related information to contract details page
- [#120](https://github.com/alleslabs/celatone-frontend/pull/120) Add simulate migrate fee and the final migration step
- [#108](https://github.com/alleslabs/celatone-frontend/pull/108) Add migrate options on migrate page and upload new code for migration
- [#130](https://github.com/alleslabs/celatone-frontend/pull/130) Add support for Terra public projects
- [#112](https://github.com/alleslabs/celatone-frontend/pull/112) Refactor past transactions page, support new messages including Migration, Instantiate2, Update Admin, Clear Admin, and change filter actions to dropdown selection. Add redo modal for instantiate2 and create component for tokens used in past tx page.
- [#113](https://github.com/alleslabs/celatone-frontend/pull/113) Update admin page ui and wireup
- [#98](https://github.com/alleslabs/celatone-frontend/pull/98) Add migrate, update admin, clear admin menu on contract list and detail
- [#102](https://github.com/alleslabs/celatone-frontend/pull/102) Add quick menu in overview and add highlighted in left sidebar
- [#125](https://github.com/alleslabs/celatone-frontend/pull/125) Add connect wallet alert in instantiate page
- [#126](https://github.com/alleslabs/celatone-frontend/pull/126) Add port id copier for IBC port id
- [#76](https://github.com/alleslabs/celatone-frontend/pull/76) Add Public projects page
- [#116](https://github.com/alleslabs/celatone-frontend/pull/116) Support Terra2.0 mainnet and testnet
- [#94](https://github.com/alleslabs/celatone-frontend/pull/94) Add unsupported assets in contract details page
- [#106](https://github.com/alleslabs/celatone-frontend/pull/106) Add sort alphabetically to query and execute shortcuts
- [#88](https://github.com/alleslabs/celatone-frontend/pull/88) Add code snippet for query and execute
- [#107](https://github.com/alleslabs/celatone-frontend/pull/107) Remove osmosis mainnet from chain list
- [#99](https://github.com/alleslabs/celatone-frontend/pull/99) Validate label and codeId field in instantiate page
- [#103](https://github.com/alleslabs/celatone-frontend/pull/103) Add check mark to selected network
- [#92](https://github.com/alleslabs/celatone-frontend/pull/92) Create select contract component for admin and migrate pages
- [#97](https://github.com/alleslabs/celatone-frontend/pull/97) Change label style to always afloat
- [#95](https://github.com/alleslabs/celatone-frontend/pull/95) Add network to url path
- [#89](https://github.com/alleslabs/celatone-frontend/pull/89) Update feedback link
- [#90](https://github.com/alleslabs/celatone-frontend/pull/90) Add update admin (`/admin`) and migrate (`/migrate`) page routes
- [#91](https://github.com/alleslabs/celatone-frontend/pull/91) Add migrate shortcut to the sidebar
- [#75](https://github.com/alleslabs/celatone-frontend/pull/75) Add code-related contracts table to the code detail page
- [#81](https://github.com/alleslabs/celatone-frontend/pull/81) Can scroll on side bar with fix deploy new contract button
- [#86](https://github.com/alleslabs/celatone-frontend/pull/86) Add transactions table in contract details page
- [#74](https://github.com/alleslabs/celatone-frontend/pull/74) Add tokens rendering for contract details page
- [#85](https://github.com/alleslabs/celatone-frontend/pull/85) Add sending asset in execute contract page
- [#84](https://github.com/alleslabs/celatone-frontend/pull/84) Contract proposals table ui and wireup
- [#82](https://github.com/alleslabs/celatone-frontend/pull/82) Add all codes page
- [#83](https://github.com/alleslabs/celatone-frontend/pull/83) Add invalid code state
- [#73](https://github.com/alleslabs/celatone-frontend/pull/73) Wireup migration table
- [#77](https://github.com/alleslabs/celatone-frontend/pull/77) Wireup code info section in code details page
- [#70](https://github.com/alleslabs/celatone-frontend/pull/70) Change default token denom on contract detail
- [#78](https://github.com/alleslabs/celatone-frontend/pull/78) Ignore building step when branch is not main
- [#62](https://github.com/alleslabs/celatone-frontend/pull/62) Add footer
- [#71](https://github.com/alleslabs/celatone-frontend/pull/71) Add search bar at the top (currently support only contract address and code id)
- [#69](https://github.com/alleslabs/celatone-frontend/pull/69) Add execute table in contract details page
- [#65](https://github.com/alleslabs/celatone-frontend/pull/60) Create instantiate button component
- [#64](https://github.com/alleslabs/celatone-frontend/pull/64) Add contract not exist page
- [#63](https://github.com/alleslabs/celatone-frontend/pull/63) Add code id explorer link and code table row navigation
- [#67](https://github.com/alleslabs/celatone-frontend/pull/67) Add Public Codes shortcut to sidebar and add Quick Actions section
- [#66](https://github.com/alleslabs/celatone-frontend/pull/66) Add code details data loader including code info and contract instances
- [#60](https://github.com/alleslabs/celatone-frontend/pull/60) Add navigation to contract row
- [#47](https://github.com/alleslabs/celatone-frontend/pull/47) Wireup init msg in contract details page
- [#51](https://github.com/alleslabs/celatone-frontend/pull/51) Wireup contract info in contract details page
- [#59](https://github.com/alleslabs/celatone-frontend/pull/59) Wireup code name, description, and cta section
- [#53](https://github.com/alleslabs/celatone-frontend/pull/53) Show contract description in contract details page
- [#58](https://github.com/alleslabs/celatone-frontend/pull/58) Wireup top section in contract details page
- [#54](https://github.com/alleslabs/celatone-frontend/pull/54) Render execute cmds shortcut in contract details page
- [#46](https://github.com/alleslabs/celatone-frontend/pull/46) Wireup instantiate info in contract details page
- [#55](https://github.com/alleslabs/celatone-frontend/pull/55) Add "Add To List / Edit" button to edit offchain details on query and execute pages
- [#44](https://github.com/alleslabs/celatone-frontend/pull/44) Render query cmds shortcut in contract details page
- [#38](https://github.com/alleslabs/celatone-frontend/pull/38) Show execute msg cmds when wallet is not connected
- [#49](https://github.com/alleslabs/celatone-frontend/pull/49) Add `develop` branch to `main.yml`
- [#39](https://github.com/alleslabs/celatone-frontend/pull/39) Render "Me" instead of user address
- [#43](https://github.com/alleslabs/celatone-frontend/pull/43) Add code details page ui skeleton
- [#37](https://github.com/alleslabs/celatone-frontend/pull/37) Add contract details data loader
- [#31](https://github.com/alleslabs/celatone-frontend/pull/31) Add contract details page ui skeleton
- [#41](https://github.com/alleslabs/celatone-frontend/pull/41) Add Github action for tracking CHANGELOG.md for changes

### Improvements

- [#204](https://github.com/alleslabs/celatone-frontend/pull/204) Change back button wording and adjust flow
- [#191](https://github.com/alleslabs/celatone-frontend/pull/191) Add typeface (Poppins) and add new styling for command shortcut
- [#190](https://github.com/alleslabs/celatone-frontend/pull/190) Setup sentry tunnel in next config
- [#179](https://github.com/alleslabs/celatone-frontend/pull/179) Add loading state to My code, Recent Codes, Contract details, Code details, All public projects, Public project, Saved Contract, Instantiated my be
- [#182](https://github.com/alleslabs/celatone-frontend/pull/182) Disable mainnet store code and show alert, refactor select chain hook and alert variants
- [#180](https://github.com/alleslabs/celatone-frontend/pull/180) Add helper text to editable cell, Change trash button to bookmark button
- [#181](https://github.com/alleslabs/celatone-frontend/pull/181) Refactor funds filtering logic and sort by denom, enable clicking the whole row of contract list when its readOnly
- [#171](https://github.com/alleslabs/celatone-frontend/pull/171) Change gql query for better speed, remove unwrap and default values, and better handle data rendering
- [#177](https://github.com/alleslabs/celatone-frontend/pull/177) Handle instantiate render: tx hash, proposal, genesis, and data not available case
- [#176](https://github.com/alleslabs/celatone-frontend/pull/176) Adjust contract table fraction, limit tag render, full ellipsis contract desc/name length
- [#168](https://github.com/alleslabs/celatone-frontend/pull/168) Past tx: Long messages should wrap to new line, clear text input when click on action in filter by actions, fail transaction should not show resend button, header table from "tx hash" to "transaction hash", send message should count unique address, contract details page transaction header (from "actions" to "messages"), hover row should display copy button
- [#174](https://github.com/alleslabs/celatone-frontend/pull/174) Change "code description" to "code name" and wireup public code name in code detail page
- [#173](https://github.com/alleslabs/celatone-frontend/pull/173) Add connect wallet alert to migrate page
- [#161](https://github.com/alleslabs/celatone-frontend/pull/161) Fix editable cell, no wrap when hover and click outside to close the editable cell
- [#159](https://github.com/alleslabs/celatone-frontend/pull/159) Add query key so refetch data when network change
- [#145](https://github.com/alleslabs/celatone-frontend/pull/145) Disable closing on some modal when click on modal overlay
- [#147](https://github.com/alleslabs/celatone-frontend/pull/147) Add empty state for select code modal
- [#140](https://github.com/alleslabs/celatone-frontend/pull/140) Add placeholder texts to upload&instantiate, save code, and save&edit contract
- [#139](https://github.com/alleslabs/celatone-frontend/pull/139) Fix Date to Dayjs
- [#135](https://github.com/alleslabs/celatone-frontend/pull/135) Invalidate queries after update/clear admin tx
- [#123](https://github.com/alleslabs/celatone-frontend/pull/123) Refactor tables to use custom components
- [#128](https://github.com/alleslabs/celatone-frontend/pull/128) Rewrite add to other list state and add default list to save to
- [#114](https://github.com/alleslabs/celatone-frontend/pull/114) Handle wallet connection cases in instantiate button
- [#115](https://github.com/alleslabs/celatone-frontend/pull/115) (Contract Details Page) Show no admin and correctly handle explorer link by address type
- [#68](https://github.com/alleslabs/celatone-frontend/pull/68) Refactor past txs link props and make sure navigation works
- [#64](https://github.com/alleslabs/celatone-frontend/pull/64) Add address validation functions for contract and user addresses
- [#52](https://github.com/alleslabs/celatone-frontend/pull/52) Create a component for disconnected State and apply to contract, code, past tx
- [#56](https://github.com/alleslabs/celatone-frontend/pull/56) Refactor offchain form component by not receiving nameField and descriptionField
- [#50](https://github.com/alleslabs/celatone-frontend/pull/50) Refactor offchain component to use react-form and remove redundant offchain components, and refactor edit contract details modal

### Bug fixes

- [#211](https://github.com/alleslabs/celatone-frontend/pull/211) Fix contract count not display for code table in public project
- [#208](https://github.com/alleslabs/celatone-frontend/pull/208) Fix messages shown in past tx page (should show only wasm and send messages)
- [#200](https://github.com/alleslabs/celatone-frontend/pull/200) Fix add attached assets property
- [#198](https://github.com/alleslabs/celatone-frontend/pull/198) Fix handle keplr wallet ready
- [#194](https://github.com/alleslabs/celatone-frontend/pull/194) Fix "connect wallet state" for tables
- [#196](https://github.com/alleslabs/celatone-frontend/pull/196) Fix rewrite rule for amplitude
- [#188](https://github.com/alleslabs/celatone-frontend/pull/188) Fix "No contact description" prefill in description section in contract detail page
- [#187](https://github.com/alleslabs/celatone-frontend/pull/187) Fix renaming list flicker to the all lists for a second
- [#184](https://github.com/alleslabs/celatone-frontend/pull/184) Fix next seo to use default seo
- [#186](https://github.com/alleslabs/celatone-frontend/pull/186) Fix logo navigation
- [#185](https://github.com/alleslabs/celatone-frontend/pull/185) Fix sentry in next.config.js
- [#183](https://github.com/alleslabs/celatone-frontend/pull/183) Fix build failed because sentry env
- [#175](https://github.com/alleslabs/celatone-frontend/pull/175) Fix css related issue and tag selection input
- [#165](https://github.com/alleslabs/celatone-frontend/pull/165) Fix messages type
- [#172](https://github.com/alleslabs/celatone-frontend/pull/172) Fix infinite loop dep, wrong fallback validation
- [#157](https://github.com/alleslabs/celatone-frontend/pull/157) Fix chain path bug when mixed up with query params
- [#154](https://github.com/alleslabs/celatone-frontend/pull/154) Stay on the same contract list page after renaming the list
- [#155](https://github.com/alleslabs/celatone-frontend/pull/155) Fix uncontrolled input error and fix space bar issue in editable cell
- [#156](https://github.com/alleslabs/celatone-frontend/pull/156) Fix json editor cannot focus by clicking on empty area
- [#166](https://github.com/alleslabs/celatone-frontend/pull/166) Change default list when editing contract information
- [#164](https://github.com/alleslabs/celatone-frontend/pull/164) Add observer in code details page
- [#151](https://github.com/alleslabs/celatone-frontend/pull/151) Fix state reset on clicking wallet button
- [#158](https://github.com/alleslabs/celatone-frontend/pull/158) Change dayjs back to Date type as it is incompatible with mobx storage
- [#153](https://github.com/alleslabs/celatone-frontend/pull/153) Fix network dropdown blocked by filter topic
- [#137](https://github.com/alleslabs/celatone-frontend/pull/137) Throw error instead of returning undefined in query function
- [#148](https://github.com/alleslabs/celatone-frontend/pull/148) Fix scrolling to table header on first land
- [#146](https://github.com/alleslabs/celatone-frontend/pull/146) Fix contract select always fetch when theres no contract address, edit query keys
- [#143](https://github.com/alleslabs/celatone-frontend/pull/143) Use dummy address only when getting execute cmds
- [#142](https://github.com/alleslabs/celatone-frontend/pull/142) Fix migration table row duplicate and add key to port id render
- [#138](https://github.com/alleslabs/celatone-frontend/pull/138) Remove execute table in contract details page (due to data issue)
- [#136](https://github.com/alleslabs/celatone-frontend/pull/136) Fix decode message from query param in execute page
- [#132](https://github.com/alleslabs/celatone-frontend/pull/132) Fix permission field in upload simulation
- [#121](https://github.com/alleslabs/celatone-frontend/pull/121) Fix code snippet for query axios
- [#129](https://github.com/alleslabs/celatone-frontend/pull/129) Fix wallet disconnection on network query change
- [#124](https://github.com/alleslabs/celatone-frontend/pull/124) Fix public project query, display project image in contract details page
- [#125](https://github.com/alleslabs/celatone-frontend/pull/125) Fix incorrect CosmJS execute snippet
- [#117](https://github.com/alleslabs/celatone-frontend/pull/117) Fix native token label formatting
- [#121](https://github.com/alleslabs/celatone-frontend/pull/121) Fix code snippet for query axios
- [#122](https://github.com/alleslabs/celatone-frontend/pull/122) Fix unknown code upload block height
- [#121](https://github.com/alleslabs/celatone-frontend/pull/121) Fix code snippet for query axios
- [#119](https://github.com/alleslabs/celatone-frontend/pull/119) Fix searching and project ordering in public projects page
- [#118](https://github.com/alleslabs/celatone-frontend/pull/118) Fix floating tooltip when scrolling out of copy button
- [#111](https://github.com/alleslabs/celatone-frontend/pull/111) Fix recent activities navigation and instantiate encode/decode
- [#105](https://github.com/alleslabs/celatone-frontend/pull/105) Propoerly show instantiator of code contracts and contract in the instantiated list
- [#72](https://github.com/alleslabs/celatone-frontend/pull/72) Fix general wording and grammar
- [#110](https://github.com/alleslabs/celatone-frontend/pull/110) Fix proposal detail rendering
- [#109](https://github.com/alleslabs/celatone-frontend/pull/109) Fix incorrect rendering of zero value badges
- [#101](https://github.com/alleslabs/celatone-frontend/pull/101) Fix incorrect truncating of proposal id in contract detail's migration table
- [#100](https://github.com/alleslabs/celatone-frontend/pull/100) Fix contract instantiated time parsing
- [#96](https://github.com/alleslabs/celatone-frontend/pull/96) Fix incorrect instantiated block height explorer link
- [#87](https://github.com/alleslabs/celatone-frontend/pull/87) Fix funds didn't microfy before sending tx
- [#80](https://github.com/alleslabs/celatone-frontend/pull/80) Fix the misalignment of state in the PastTx page
- [#42](https://github.com/alleslabs/celatone-frontend/pull/42) Properly show CTAs on contract-list page and edit zero/disconnected state
- [#45](https://github.com/alleslabs/celatone-frontend/pull/45) Add chain ID and code details to contract detail data loader

### Docs

- [#57](https://github.com/alleslabs/celatone-frontend/pull/57) Rewrite README file with more information and structure
