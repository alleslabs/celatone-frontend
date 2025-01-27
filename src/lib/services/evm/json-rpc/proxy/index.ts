import { HexAddr20, Nullable } from "lib/types";
import { getEthCall, getEthGetCode, getEthGetStorageAt } from "../eth";
import { ProxyResult, ProxyType } from "./types";
import { parse1167Bytecode, readAddress } from "./utils";

// obtained as bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1)
const EIP_1967_LOGIC_SLOT =
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

// obtained as keccak256("org.zeppelinos.proxy.implementation")
const OPEN_ZEPPELIN_IMPLEMENTATION_SLOT =
  "0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3";

// obtained as keccak256("PROXIABLE")
const EIP_1822_LOGIC_SLOT =
  "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7";

// obtained as bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1)
const EIP_1967_BEACON_SLOT =
  "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50";

const EIP_897_INTERFACE = [
  // bytes4(keccak256("implementation()")) padded to 32 bytes
  "0x5c60da1b00000000000000000000000000000000000000000000000000000000",

  // bytes4(keccak256("proxyType()")) padded to 32 bytes
  "0x4555d5c900000000000000000000000000000000000000000000000000000000",
];

const EIP_1967_BEACON_METHODS = [
  // bytes4(keccak256("implementation()")) padded to 32 bytes
  "0x5c60da1b00000000000000000000000000000000000000000000000000000000",
  // bytes4(keccak256("childImplementation()")) padded to 32 bytes
  // some implementations use this over the standard method name so that the beacon contract is not detected as an EIP-897 proxy itself
  "0xda52571600000000000000000000000000000000000000000000000000000000",
];

const SAFE_PROXY_INTERFACE = [
  // bytes4(keccak256("masterCopy()")) padded to 32 bytes
  "0xa619486e00000000000000000000000000000000000000000000000000000000",
];

const COMPTROLLER_PROXY_INTERFACE = [
  // bytes4(keccak256("comptrollerImplementation()")) padded to 32 bytes
  "0xbb82aa5e00000000000000000000000000000000000000000000000000000000",
];

export const getEvmProxyTarget = (
  endpoint: string,
  proxyAddress: HexAddr20
): Promise<Nullable<ProxyResult>> =>
  Promise.any([
    // EIP-1167 Minimal Proxy Contract
    getEthGetCode(endpoint, proxyAddress)
      .then(parse1167Bytecode)
      .then(readAddress)
      .then((target) => ({
        target,
        type: ProxyType.Eip1167,
        immutable: true,
      })),

    // EIP-1967 direct proxy
    getEthGetStorageAt(endpoint, proxyAddress, EIP_1967_LOGIC_SLOT)
      .then(readAddress)
      .then((target) => ({
        target,
        type: ProxyType.Eip1967Direct,
        immutable: false,
      })),

    // EIP-1967 beacon proxy
    getEthGetStorageAt(endpoint, proxyAddress, EIP_1967_BEACON_SLOT)
      .then(readAddress)
      .then((beaconAddress) =>
        getEthCall(
          endpoint,
          null,
          beaconAddress,
          EIP_1967_BEACON_METHODS[0]
        ).catch(() =>
          getEthCall(endpoint, null, beaconAddress, EIP_1967_BEACON_METHODS[1])
        )
      )
      .then(readAddress)
      .then((target) => ({
        target,
        type: ProxyType.Eip1967Beacon,
        immutable: false,
      })),

    // OpenZeppelin proxy pattern
    getEthGetStorageAt(
      endpoint,
      proxyAddress,
      OPEN_ZEPPELIN_IMPLEMENTATION_SLOT
    )
      .then(readAddress)
      .then((target) => ({
        target,
        type: ProxyType.OpenZeppelin,
        immutable: false,
      })),

    // EIP-1822 Universal Upgradeable Proxy Standard
    getEthGetStorageAt(endpoint, proxyAddress, EIP_1822_LOGIC_SLOT)
      .then(readAddress)
      .then((target) => ({
        target,
        type: ProxyType.Eip1822,
        immutable: false,
      })),

    // EIP-897 DelegateProxy pattern
    getEthCall(endpoint, null, proxyAddress, EIP_897_INTERFACE[0])
      .then(readAddress)
      .then(async (target) => ({
        target,
        type: ProxyType.Eip897,
        // proxyType === 1 means that the proxy is immutable
        immutable:
          (await getEthCall(
            endpoint,
            null,
            proxyAddress,
            EIP_897_INTERFACE[1]
          ).catch(() => undefined)) ===
          "0x0000000000000000000000000000000000000000000000000000000000000001",
      })),

    // SafeProxy contract
    getEthCall(endpoint, null, proxyAddress, SAFE_PROXY_INTERFACE[0])
      .then(readAddress)
      .then((target) => ({
        target,
        type: ProxyType.Safe,
        immutable: false,
      })),

    // Comptroller proxy
    getEthCall(endpoint, null, proxyAddress, COMPTROLLER_PROXY_INTERFACE[0])
      .then(readAddress)
      .then((target) => ({
        target,
        type: ProxyType.Comptroller,
        immutable: false,
      })),
  ]).catch(() => null);
