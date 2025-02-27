import {
  useEvmConfig,
  useInternalNavigate,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import { useEvmCodesByAddress } from "lib/services/evm";
import { useContractData } from "lib/services/wasm/contract";
import { zHexAddr20 } from "lib/types";
import type { BechAddr, BechAddr32, HexAddr } from "lib/types";
import { isHexWalletAddress } from "lib/utils";

export const useAccountRedirect = (bechAddr: BechAddr, hexAddr: HexAddr) => {
  const wasm = useWasmConfig({ shouldRedirect: false });
  const evm = useEvmConfig({ shouldRedirect: false });

  const { validateContractAddress } = useValidateAddress();

  const navigate = useInternalNavigate();

  const { data: wasmContractData, isFetching: isWasmContractDataFetching } =
    useContractData(bechAddr as BechAddr32, {
      enabled: wasm.enabled && validateContractAddress(bechAddr) === null,
    });

  const { data: evmCodes, isFetching: isEvmCodesFetching } =
    useEvmCodesByAddress(
      zHexAddr20.parse(hexAddr),
      evm.enabled && isHexWalletAddress(hexAddr)
    );

  if (wasmContractData) {
    navigate({
      pathname: "/contracts/[contractAddress]",
      query: { contractAddress: bechAddr },
    });
    return true;
  }

  if (evmCodes?.code) {
    navigate({
      pathname: "/evm-contracts/[contractAddress]",
      query: { contractAddress: hexAddr },
    });
    return true;
  }

  return isWasmContractDataFetching || isEvmCodesFetching;
};
