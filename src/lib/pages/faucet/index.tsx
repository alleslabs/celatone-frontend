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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
import { useOpenTxTab } from "lib/hooks";
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

// todo: handle token symbol by current chain
const Faucet = () => {
  const { address: walletAddress = "" } = useWallet();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ state: "init" });
  const [result, setResult] = useState<Result>({});

  const { validateUserAddress } = useValidateAddress();
  const { isTestnet } = useCurrentNetwork();
  const navigate = useInternalNavigate();
  const toast = useToast();
  const router = useRouter();
  const openTxTab = useOpenTxTab("tx-page");

  const faucetUrl = process.env.NEXT_PUBLIC_FAUCET_URL;

  useEffect(() => {
    if (!isTestnet) navigate({ pathname: "/" });
    else if (router.isReady) AmpTrack(AmpEvent.TO_FAUCET);
  }, [isTestnet, navigate, router]);

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
          title: "10 Testnet OSMO sent from the faucet",
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
            "Sent 10 testnet OSMO from the faucet. You will need to wait for another hour to request again.",
          txHash,
        });
      })
      .catch((err: Error | AxiosError) => {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 429) {
            setResult({
              status: "warning",
              message:
                "There is a limit of one request per hour for each receiving address and IP address. Please try again later.",
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
        Osmosis Testnet Faucet
      </Heading>
      <Text variant="body2" color="text.dark" pt={4} textAlign="center" mb={8}>
        The faucet provides 10 testnet OSMO per request. Requests are limited to
        once per hour for each receiving address and IP address.
      </Text>
      <TextInput
        variant="floating"
        placeholder="Enter your address"
        value={address}
        setInputState={setAddress}
        status={status}
        label="Receiving Address"
        helperAction={
          <Text
            color="accent.main"
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
        Request 10 testnet OSMO
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
            <Button
              variant="unstyled"
              minW="unset"
              size="sm"
              _hover={{ background: "success.dark" }}
              style={{ padding: "4px 12px" }}
              onClick={() => openTxTab(result.txHash)}
            >
              View Transaction
            </Button>
          )}
        </Alert>
      )}
    </WasmPageContainer>
  );
};

export default Faucet;
