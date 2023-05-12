import {
  Alert,
  AlertDescription,
  Flex,
  Heading,
  Button,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useInternalNavigate, useLCDEndpoint } from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

const getCodeUploadAccess = async (endpoint: string) => {
  const codeParamsUrl = `${endpoint}/cosmwasm/wasm/v1/codes/params`;
  return axios
    .get(codeParamsUrl)
    .then((res) => res.data.params.code_upload_access);
};

const enableUpload = (
  isPermissionedNetwork: boolean,
  whitelistedAddresses: string[],
  address: string | undefined
) => {
  let enabled = false;
  if (!isPermissionedNetwork) {
    enabled = true;
  }
  if (address && isPermissionedNetwork) {
    enabled = whitelistedAddresses.includes(address);
  }
  return enabled;
};

const Deploy = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const endpoint = useLCDEndpoint();
  const { address } = useWallet();
  const [isPermissionedNetwork, setIsPermissionedNetwork] = useState(false);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_DEPLOY);
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      const codeUploadAccess = await getCodeUploadAccess(endpoint);
      setIsPermissionedNetwork(codeUploadAccess.permission !== "Everybody");
      setWhitelistedAddresses(codeUploadAccess.addresses);
    })();
  }, [endpoint]);

  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper mode="deploy" currentStep={1} />
      <Heading as="h5" variant="h5" my="48px">
        Select Deploy Option
      </Heading>
      <ConnectWalletAlert
        subtitle="You need to connect wallet to proceed this action"
        mb={8}
      />
      {!enableUpload(isPermissionedNetwork, whitelistedAddresses, address) && (
        <Alert variant="violet" mb="16px" alignItems="flex-start" gap="1">
          <CustomIcon
            name="info-circle-solid"
            color="violet.ligth"
            boxSize="20px"
          />
          <AlertDescription>
            The current network is a permissioned CosmWasm network. Only
            whitelisted addresses can directly upload Wasm files.
          </AlertDescription>
        </Alert>
      )}
      {isPermissionedNetwork &&
        enableUpload(isPermissionedNetwork, whitelistedAddresses, address) && (
          <Alert mb={8} variant="success">
            <CustomIcon
              name="check-circle-solid"
              color="success.main"
              boxSize="6"
              display="flex"
              alignItems="center"
            />
            <AlertDescription mx={4}>
              Your address is allowed to directly upload Wasm files
            </AlertDescription>
          </Alert>
        )}
      <ButtonCard
        title="Upload new WASM File"
        description={
          isPermissionedNetwork ? (
            <Flex fontSize="14px" gap={1}>
              <Text
                color={isPermissionedNetwork ? "text.disabled" : "text.main"}
              >
                Available for whitelisted addresses only
              </Text>
            </Flex>
          ) : (
            "Store a new Wasm file on-chain"
          )
        }
        disabled={
          !enableUpload(isPermissionedNetwork, whitelistedAddresses, address)
        }
        onClick={() => navigate({ pathname: "/upload" })}
        mb="16px"
      />
      <ButtonCard
        title="Use existing Code IDs"
        description="Input code ID or select from previously stored or saved codes"
        onClick={() => navigate({ pathname: "/instantiate" })}
        disabled={!address}
      />
      <Flex justify="center" w="100%" mt="32px">
        <Button
          onClick={() => {
            router.back();
          }}
          size="md"
          variant="ghost-gray"
        >
          Cancel
        </Button>
      </Flex>
    </WasmPageContainer>
  );
};

export default Deploy;
