import { NetworkStore } from "./networks";

describe("NetworkStore", () => {
  let networkStore: NetworkStore;

  beforeEach(() => {
    networkStore = new NetworkStore();
  });

  test("initial pinned networks should be empty", () => {
    expect(networkStore.getPinnedNetworks()).toEqual([]);
  });

  test("isNetworkPinned should return false for non-pinned network", () => {
    expect(networkStore.isNetworkPinned("chainId1")).toBe(false);
  });

  test("pinNetwork should add a network to pinned networks", () => {
    networkStore.pinNetwork("chainId1");
    expect(networkStore.getPinnedNetworks()).toEqual(["chainId1"]);
  });

  test("pinNetwork should not add duplicate network to pinned networks", () => {
    networkStore.pinNetwork("chainId1");
    networkStore.pinNetwork("chainId1");
    expect(networkStore.getPinnedNetworks()).toEqual(["chainId1"]);
  });

  test("removeNetwork should remove a network from pinned networks", () => {
    networkStore.pinNetwork("chainId1");
    networkStore.removeNetwork("chainId1");
    expect(networkStore.getPinnedNetworks()).toEqual([]);
  });

  test("setPinnedNetworks should set the pinned networks", () => {
    networkStore.setPinnedNetworks(["chainId1", "chainId2"]);
    expect(networkStore.getPinnedNetworks()).toEqual(["chainId1", "chainId2"]);
  });
});
