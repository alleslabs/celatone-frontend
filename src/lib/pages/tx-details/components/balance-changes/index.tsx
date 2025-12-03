import type {
  Metadata,
  BalanceChanges as TotalBalanceChanges,
} from "@initia/tx-decoder";

import { EvmBalanceChangesComponent } from "./evm-balance-changes-component";
import { MoveBalanceChangesComponent } from "./move-balance-changes-component";
import { WasmBalanceChangesComponent } from "./wasm-balance-changes-component";

interface BalanceChangesProps {
  metadata?: Metadata;
  totalBalanceChanges: TotalBalanceChanges;
}

export const BalanceChanges = ({
  metadata,
  totalBalanceChanges,
}: BalanceChangesProps) => {
  if (totalBalanceChanges.vm === "evm") {
    return (
      <EvmBalanceChangesComponent
        evmBalanceChanges={totalBalanceChanges}
        metadata={metadata}
      />
    );
  }

  if (totalBalanceChanges.vm === "wasm") {
    return (
      <WasmBalanceChangesComponent
        metadata={metadata}
        wasmBalanceChanges={totalBalanceChanges}
      />
    );
  }

  return (
    <MoveBalanceChangesComponent
      metadata={metadata}
      moveBalanceChanges={totalBalanceChanges}
    />
  );
};
