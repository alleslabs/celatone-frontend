import {
  Alert,
  AlertDescription,
  Flex,
  Heading,
  Button,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  useInternalNavigate,
  useSelectChain,
  useLCDEndpoint,
} from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { CustomIcon } from "lib/components/icon";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { getChainNameByNetwork } from "lib/data";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

const getUploadAccess = async (endpoint: string) => {
  const codeParamsUrl = `${endpoint}/cosmwasm/wasm/v1/codes/params`;
  return axios
    .get(codeParamsUrl)
    .then((res) => res.data.params.code_upload_access.permission);
};

const Deploy = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const selectChain = useSelectChain();
  const endpoint = useLCDEndpoint();
  const [canUpload, setCanUpload] = useState(false);

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_DEPLOY);
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      const uploadAccess = await getUploadAccess(endpoint);
      setCanUpload(uploadAccess === "Everybody");
    })();
  });

  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper mode="deploy" currentStep={1} />
      <Heading as="h5" variant="h5" my="48px">
        Select Deploy Option
      </Heading>
      {!canUpload && (
        <Alert variant="violet" mb="16px" alignItems="flex-start" gap="1">
          <CustomIcon
            name="info-circle-solid"
            color="violet.ligth"
            boxSize="20px"
          />
          <AlertDescription>
            Uploading new Wasm files on permissioned chains is coming soon to
            Celatone. Currently, you can upload codes and instantiate contracts
            on permissionless networks
          </AlertDescription>
        </Alert>
      )}
      <ButtonCard
        title="Upload new WASM File"
        description={
          !canUpload ? (
            <Flex fontSize="14px" gap={1}>
              <Text color="text.disabled">
                Currently available on permissionless networks only.
              </Text>
              <Text
                color="honeydew.main"
                _hover={{ textDecoration: "underline" }}
                cursor="pointer"
                onClick={() => selectChain(getChainNameByNetwork("testnet"))}
              >
                Switch to testnet
              </Text>
            </Flex>
          ) : (
            "Store a new Wasm file on-chain"
          )
        }
        disabled={!canUpload}
        onClick={() => navigate({ pathname: "/upload" })}
        mb="16px"
      />
      <ButtonCard
        title="Use existing Code IDs"
        description="Input code ID or select from previously stored or saved codes"
        onClick={() => navigate({ pathname: "/instantiate" })}
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
