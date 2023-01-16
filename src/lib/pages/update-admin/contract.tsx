import { useRouter } from "next/router";

import { useValidateAddress } from "lib/hooks";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import UpdateAdmin from ".";

const UpdateAdminContract = () => {
  const router = useRouter();
  const { validateContractAddress } = useValidateAddress();

  const contractAddressParam = getFirstQueryParam(router.query.contractAddress);

  return (
    <UpdateAdmin
      contractAddr={
        !validateContractAddress(contractAddressParam)
          ? (contractAddressParam as ContractAddr)
          : undefined
      }
    />
  );
};

export default UpdateAdminContract;
