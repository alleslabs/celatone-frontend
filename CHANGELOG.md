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
- [#61](https://github.com/alleslabs/celatone-frontend/pull/61) Add UI for send asset in execute contract page
- [#59](https://github.com/alleslabs/celatone-frontend/pull/58) Wireup code name,description, and cta section
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

- [#52](https://github.com/alleslabs/celatone-frontend/pull/52) Create a component for disconnected State and apply to contract, code, past tx
- [#56](https://github.com/alleslabs/celatone-frontend/pull/56) Refactor offchain form component by not receiving nameField and descriptionField
- [#50](https://github.com/alleslabs/celatone-frontend/pull/50) Refactor offchain component to use react-form and remove redundant offchain components, and refactor edit contract details modal

### Bug fixes

- [#42](https://github.com/alleslabs/celatone-frontend/pull/42) Properly show CTAs on contract-list page and edit zero/disconnected state
- [#45](https://github.com/alleslabs/celatone-frontend/pull/45) Add chain ID and code details to contract detail data loader

### Docs

- [#57](https://github.com/alleslabs/celatone-frontend/pull/57) Rewrite README file with more information and structure
