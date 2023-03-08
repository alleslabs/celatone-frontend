import {
  Alert,
  AlertDescription,
  Button,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";

import { getExplorerTxUrl } from "lib/app-fns/explorer";
import {
  useCurrentNetwork,
  useInternalNavigate,
  useValidateAddress,
} from "lib/app-provider";
import { BackButton } from "lib/components/button";
import type { FormStatus } from "lib/components/forms";
import { TextInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

type ResultStatus = "success" | "error" | "warning";

interface Result {
  status?: ResultStatus;
  txHash?: string;
  message?: string;
}

const STATUS_ICONS: Record<ResultStatus, IconKeys> = {
  success: "check-circle-solid",
  error: "alert-circle-solid",
  warning: "alert-circle-solid",
};

const Faucet = () => {
  const { address: walletAddress = "", currentChainName } = useWallet();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ state: "init" });
  const [result, setResult] = useState<Result>({});

  const { validateUserAddress } = useValidateAddress();
  const { isTestnet } = useCurrentNetwork();
  const navigate = useInternalNavigate();
  const toast = useToast();

  const faucetUrl = process.env.NEXT_PUBLIC_FAUCET_URL;
  const txLinkUrl = getExplorerTxUrl(currentChainName);

  useEffect(() => {
    if (!isTestnet) {
      navigate({ pathname: "/" });
    }
  }, [isTestnet, navigate]);

  useEffect(() => {
    if (address) {
      const errorMsg = validateUserAddress(address);
      if (errorMsg) {
        setStatus({ state: "error", message: errorMsg });
      } else {
        setStatus({ state: "success" });
      }
    }
  }, [address, validateUserAddress]);

  const onSubmit = async () => {
    setIsLoading(true);
    AmpTrack(AmpEvent.ACTION_FAUCET);

    if (!faucetUrl) {
      setResult({ status: "error", message: "Faucet URL not set" });
      setIsLoading(false);
      return;
    }

    await axios
      .post<{ address: string }, AxiosResponse<{ txHash: string }>>(faucetUrl, {
        address,
      })
      .then(({ data: { txHash } }) => {
        toast({
          title: "10.00 Testnet OSMO sent from the faucet",
          status: "success",
          duration: 5000,
          isClosable: false,
          position: "bottom-right",
          icon: (
            <CustomIcon
              name="check-circle-solid"
              color="success.main"
              boxSize="4"
              display="flex"
              alignItems="center"
            />
          ),
        });

        AmpTrack(AmpEvent.TX_SUCCEED);
        setIsLoading(false);
        setResult({
          status: "success",
          message:
            "10.00 OSMO sent from the faucet. You will need to wait for another hour to request again.",
          txHash,
        });
      })
      .catch((err: Error | AxiosError) => {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 429) {
            setResult({
              status: "warning",
              message:
                "There is a limit of one request per hour. If you have already made a request in the past hour, please try again later.",
            });
          } else {
            setResult({
              status: "error",
              message: err.response?.data?.error?.message || err.message,
            });
          }
        } else {
          setResult({
            status: "error",
            message: err.message,
          });
        }

        AmpTrack(AmpEvent.TX_FAILED);
        setIsLoading(false);
      });
  };

  const disabled = status.state !== "success" || isLoading;

  return (
    <WasmPageContainer>
      <BackButton alignSelf="flex-start" />
      <Heading as="h5" variant="h5">
        Testnet OSMO Faucet
      </Heading>
      <Text variant="body2" color="pebble.600" pt={4} textAlign="center" mb={8}>
        The Faucet provides 10.00 testnet OSMO per request for osmo-test-4
        network. Please note that there is a limit of one request per hour.
      </Text>
      <TextInput
        variant="floating"
        value={address}
        setInputState={setAddress}
        status={status}
        label="Receiving Address"
        helperAction={
          <Text
            color="honeydew.main"
            fontWeight="600"
            variant="body3"
            cursor="pointer"
            alignSelf="flex-start"
            onClick={() => {
              AmpTrack(AmpEvent.USE_ASSIGN_ME);
              setAddress(walletAddress);
            }}
          >
            Assign me
          </Text>
        }
      />
      <Button
        mt={8}
        w="full"
        onClick={onSubmit}
        isLoading={isLoading}
        disabled={disabled}
      >
        Receive 10.00 Testnet OSMO
      </Button>
      {result.status && (
        <Alert mt={8} variant={result.status}>
          <CustomIcon
            name={STATUS_ICONS[result.status]}
            color={`${result.status}.main`}
            boxSize="6"
            display="flex"
            alignItems="center"
          />
          <AlertDescription mx={4}>
            {result.message || "Something went wrong"}
          </AlertDescription>
          {result.txHash && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${txLinkUrl}/${result.txHash}`}
            >
              <Button
                variant="unstyled"
                minW="unset"
                size="sm"
                _hover={{ background: "success.dark" }}
                style={{ padding: "4px 12px" }}
              >
                View Transaction
              </Button>
            </a>
          )}
        </Alert>
      )}
    </WasmPageContainer>
  );
};

export default Faucet;
