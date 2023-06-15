import {
  Alert,
  AlertDescription,
  Button,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import {
  useCelatoneApp,
  useCurrentChain,
  useFaucetConfig,
  useInternalNavigate,
  useValidateAddress,
} from "lib/app-provider";
import { AssignMe } from "lib/components/AssignMe";
import type { FormStatus } from "lib/components/forms";
import { TextInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useOpenTxTab } from "lib/hooks";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { capitalize } from "lib/utils";

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
  const { address: walletAddress = "" } = useCurrentChain();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ state: "init" });
  const [result, setResult] = useState<Result>({});

  const { validateUserAddress } = useValidateAddress();
  const navigate = useInternalNavigate();
  const toast = useToast();
  const router = useRouter();
  const openTxTab = useOpenTxTab("tx-page");
  const {
    chainConfig: { chain },
  } = useCelatoneApp();
  const faucet = useFaucetConfig();

  const { faucetUrl, faucetDenom, faucetAmount } = useMemo(() => {
    if (!faucet.enabled)
      // Remark: this shouldn't be used as the faucet is disabled
      return {
        faucetUrl: "",
        faucetDenom: "",
        faucetAmount: "",
      };

    return {
      faucetUrl: faucet.url,
      faucetDenom: faucet.denom.toUpperCase(),
      faucetAmount: faucet.amount,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faucet.enabled]);

  useEffect(() => {
    if (!faucet.enabled) navigate({ pathname: "/", replace: true });
    if (router.isReady) AmpTrack(AmpEvent.TO_FAUCET);
  }, [faucet, navigate, router]);

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
          title: `${faucetAmount} Testnet ${faucetDenom} sent from the faucet`,
          status: "success",
          duration: 5000,
          isClosable: false,
          position: "bottom-right",
          icon: (
            <CustomIcon
              name="check-circle-solid"
              color="success.main"
              boxSize={4}
              display="flex"
              alignItems="center"
            />
          ),
        });

        AmpTrack(AmpEvent.TX_SUCCEED);
        setIsLoading(false);
        setResult({
          status: "success",
          message: `Sent ${faucetAmount} testnet ${faucetDenom} from the faucet. You will need to wait for another hour to request again.`,
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
      <Heading as="h5" variant="h5">
        {capitalize(chain)} Testnet Faucet
      </Heading>
      <Text variant="body2" color="text.dark" pt={4} textAlign="center" mb={8}>
        The faucet provides {faucetAmount} testnet {faucetDenom} per request.
        Requests are limited to once per hour for each receiving address and IP
        address.
      </Text>
      <TextInput
        variant="floating"
        placeholder="Enter your address"
        value={address}
        setInputState={setAddress}
        status={status}
        label="Receiving Address"
        helperAction={
          <AssignMe
            onClick={() => {
              AmpTrack(AmpEvent.USE_ASSIGN_ME);
              setAddress(walletAddress);
            }}
            isDisable={address === walletAddress}
            textAlign="left"
          />
        }
      />
      <Button
        mt={8}
        w="full"
        onClick={onSubmit}
        isLoading={isLoading}
        disabled={disabled}
      >
        Request {faucetAmount} testnet {faucetDenom}
      </Button>
      {result.status && (
        <Alert mt={8} variant={result.status}>
          <CustomIcon
            name={STATUS_ICONS[result.status]}
            color={`${result.status}.main`}
            boxSize={6}
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
