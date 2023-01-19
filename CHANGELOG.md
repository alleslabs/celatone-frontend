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

- [#72](https://github.com/alleslabs/celatone-frontend/pull/72) Fix general wording and grammar
- [#101](https://github.com/alleslabs/celatone-frontend/pull/101) Fix incorrect truncating of proposal id in contract detail's migration table
- [#100](https://github.com/alleslabs/celatone-frontend/pull/100) Fix contract instantiated time parsing
- [#97](https://github.com/alleslabs/celatone-frontend/pull/97) Change label style to always afloat
- [#96](https://github.com/alleslabs/celatone-frontend/pull/96) Fix incorrect instantiated block height explorer link
- [#95](https://github.com/alleslabs/celatone-frontend/pull/95) Add network to url path
- [#89](https://github.com/alleslabs/celatone-frontend/pull/89) Update feedback link
- [#90](https://github.com/alleslabs/celatone-frontend/pull/90) Add update admin (`/admin`) and migrate (`/migrate`) page routes
- [#91](https://github.com/alleslabs/celatone-frontend/pull/91) Add migrate shortcut to the sidebar
- [#75](https://github.com/alleslabs/celatone-frontend/pull/75) Add code-related contracts table to the code detail page
- [#81](https://github.com/alleslabs/celatone-frontend/pull/81) Can scroll on side bar with fix deploy new contract button
- [#86](https://github.com/alleslabs/celatone-frontend/pull/86) Add transactions table in contract details page
- [#74](https://github.com/alleslabs/celatone-frontend/pull/74) Add tokens rendering for contract details page
- [#87](https://github.com/alleslabs/celatone-frontend/pull/87) Fix funds didn't microfy before sending tx
- [#85](https://github.com/alleslabs/celatone-frontend/pull/85) Add sending asset in execute contract page
- [#84](https://github.com/alleslabs/celatone-frontend/pull/84) Contract proposals table ui and wireup
- [#82](https://github.com/alleslabs/celatone-frontend/pull/82) Add all codes page
- [#83](https://github.com/alleslabs/celatone-frontend/pull/83) Add invalid code state
- [#73](https://github.com/alleslabs/celatone-frontend/pull/73) Wireup migration table
- [#77](https://github.com/alleslabs/celatone-frontend/pull/77) Wireup code info section in code details page
- [#80](https://github.com/alleslabs/celatone-frontend/pull/80) Fix the misalignment of state in the PastTx page
- [#70](https://github.com/alleslabs/celatone-frontend/pull/70) Change default token denom on contract detail
- [#78](https://github.com/alleslabs/celatone-frontend/pull/78) Ignore building step when branch is not main
- [#62](https://github.com/alleslabs/celatone-frontend/pull/62) Add footer
- [#71](https://github.com/alleslabs/celatone-frontend/pull/71) Add search bar at the top (currently support only contract address and code id)
- [#69](https://github.com/alleslabs/celatone-frontend/pull/69) Add execute table in contract details page
- [#68](https://github.com/alleslabs/celatone-frontend/pull/63) Refactor past txs link props and make sure navigation works
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

- [#64](https://github.com/alleslabs/celatone-frontend/pull/64) Add address validation functions for contract and user addresses
- [#52](https://github.com/alleslabs/celatone-frontend/pull/52) Create a component for disconnected State and apply to contract, code, past tx
- [#56](https://github.com/alleslabs/celatone-frontend/pull/56) Refactor offchain form component by not receiving nameField and descriptionField
- [#50](https://github.com/alleslabs/celatone-frontend/pull/50) Refactor offchain component to use react-form and remove redundant offchain components, and refactor edit contract details modal

### Bug fixes

- [#42](https://github.com/alleslabs/celatone-frontend/pull/42) Properly show CTAs on contract-list page and edit zero/disconnected state
- [#45](https://github.com/alleslabs/celatone-frontend/pull/45) Add chain ID and code details to contract detail data loader

### Docs

- [#57](https://github.com/alleslabs/celatone-frontend/pull/57) Rewrite README file with more information and structure
