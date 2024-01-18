import { Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import PageContainer from "lib/components/PageContainer";

import { RecentModulesTable } from "./components/RecentModulesTable";

const RecentModules = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_MODULES);
  }, [router.isReady]);

  return (
    <PageContainer>
      <Heading variant="h5" as="h5" minH="36px">
        Modules
      </Heading>
      <Text variant="body2" color="text.dark" mb={8}>
        These modules are the most recently published on this network
      </Text>
      <RecentModulesTable />
    </PageContainer>
  );
};

export default RecentModules;
