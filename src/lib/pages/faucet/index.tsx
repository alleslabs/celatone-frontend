import type { AxiosError, AxiosResponse } from "axios";
import type { FormStatus } from "lib/components/forms";
import type { IconKeys } from "lib/components/icon";

import {
  Alert,
  AlertDescription,
  Button,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useCurrentChain,
  useInternalNavigate,
  useValidateAddress,
} from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { AssignMe } from "lib/components/AssignMe";
import { TextInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { useOpenTxTab } from "lib/hooks";
import { useFaucetInfo } from "lib/services/faucetService";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

type ResultStatus = "success" | "error" | "warning";

interface Result {
  status?: ResultStatus;
  txHash?: string;
  message?: string;
}

const STATUS_ICONS: Record<ResultStatus, IconKeys> = {
  success: "check-circle-solid",
  error: "alert-triangle-solid",
  warning: "alert-triangle-solid",
};

const Faucet = () => {
  // NOTE: hacked to disable
  const navigate = useInternalNavigate();
  navigate({ pathname: "/", replace: true });
  const faucet = { enabled: false, url: "" };

  // ------------------------------------------//

  const { address: walletAddress = "" } = useCurrentChain();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ state: "init" });
  const [result, setResult] = useState<Result>({});

  const { validateUserAddress } = useValidateAddress();
  const toast = useToast();
  const router = useRouter();
  const openTxTab = useOpenTxTab("tx-page");
  const {
    chainConfig: { prettyName },
  } = useCelatoneApp();

  const { data: faucetInfo } = useFaucetInfo();

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
      faucetDenom: faucetInfo?.formattedDenom ?? "token",
      faucetAmount: faucetInfo?.formattedAmount,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faucet.enabled, faucetInfo?.formattedAmount, faucetInfo?.formattedDenom]);

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_FAUCET);
  }, [router]);

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
    track(AmpEvent.ACTION_FAUCET);

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
              alignItems="center"
              boxSize={4}
              color="success.main"
              display="flex"
              name="check-circle-solid"
            />
          ),
        });

        track(AmpEvent.TX_SUCCEED);
        setIsLoading(false);
        setResult({
          status: "success",
          message: `Sent ${faucetAmount} testnet ${faucetDenom} from the faucet. ${
            faucetInfo?.RateLimit
              ? "You will need to wait for another hour to request again."
              : ""
          }`,
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

        track(AmpEvent.TX_FAILED);
        setIsLoading(false);
      });
  };

  const isDisabled = status.state !== "success" || isLoading;

  return (
    <ActionPageContainer>
      <Heading as="h5" variant="h5">
        {prettyName} Faucet
      </Heading>
      <Text color="text.dark" mb={8} pt={4} textAlign="center" variant="body2">
        The faucet provides {faucetAmount} testnet {faucetDenom} per request.{" "}
        {faucetInfo?.RateLimit &&
          "Requests are limited to once per hour for each receiving address and IP address."}
      </Text>
      <TextInput
        helperAction={
          <AssignMe
            isDisable={address === walletAddress}
            textAlign="left"
            onClick={() => {
              track(AmpEvent.USE_ASSIGN_ME);
              setAddress(walletAddress);
            }}
          />
        }
        label="Receiving Address"
        placeholder="Enter your address"
        setInputState={setAddress}
        status={status}
        value={address}
        variant="fixed-floating"
      />
      <Button
        isDisabled={isDisabled}
        isLoading={isLoading}
        mt={8}
        w="full"
        onClick={onSubmit}
      >
        Request {faucetAmount} testnet {faucetDenom}
      </Button>
      {result.status && (
        <Alert mt={8} variant={result.status}>
          <CustomIcon
            alignItems="center"
            boxSize={6}
            color={`${result.status}.main`}
            display="flex"
            name={STATUS_ICONS[result.status]}
          />
          <AlertDescription mx={4}>
            {result.message || "Something went wrong"}
          </AlertDescription>
          {result.txHash && (
            <Button
              style={{ padding: "4px 12px" }}
              _hover={{ background: "success.dark" }}
              minW="unset"
              ml="auto"
              size="sm"
              variant="unstyled"
              onClick={() => openTxTab(result.txHash)}
            >
              View Transaction
            </Button>
          )}
        </Alert>
      )}
    </ActionPageContainer>
  );
};

export default Faucet;
