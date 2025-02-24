import { Button, Grid, Stack, Text } from "@chakra-ui/react";
import type { User } from "firebase/auth";
import { CustomIcon } from "lib/components/icon";
import { useAuth } from "lib/hooks";
import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { auth, signInWithPopup, googleProvider, isEnable } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, [auth]);

  const handleSignIn = async () => signInWithPopup(auth, googleProvider);

  if (!user && isEnable) {
    return (
      <Grid bg="background.main" h="100vh" m="auto" placeItems="center" p={4}>
        <Stack align="center" spacing={12}>
          <Stack align="center" textAlign="center" spacing={4}>
            <Image
              src="https://assets.alleslabs.dev/integrations/initia/app-logo/scan.svg"
              alt="Scan"
              width={200}
              height={72}
            />
            <Text color="gray.500">
              Track accounts, transactions, and blocks across all Interwoven
              Rollups
            </Text>
          </Stack>
          <Button
            onClick={handleSignIn}
            leftIcon={<CustomIcon name="google" />}
            size="md"
          >
            Sign in with Google
          </Button>
        </Stack>
      </Grid>
    );
  }

  return children;
};
