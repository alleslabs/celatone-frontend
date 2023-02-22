import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { CustomIcon } from "lib/components/icon/CustomIcon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

// import { PastTransaction } from "./components/PastTransaction";
import { QuickMenu } from "./components/QuickMenu";
import { RecentActivities } from "./components/RecentActivities";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_OVERVIEW);
  }, [router.isReady]);

  return (
    <Box mx="1">
      <QuickMenu />
      <Flex>
        <CustomIcon name="modeLight" />
        <CustomIcon name="modeDark" />
        <CustomIcon name="discord" />
        <CustomIcon name="admin" />
        <CustomIcon name="assetsSolid" />
        <CustomIcon name="adminClear" />
        <CustomIcon name="adminClearSolid" />
        <CustomIcon name="adminEdit" />
        <CustomIcon name="adminLock" />
        <CustomIcon name="adminLockSolid" />
        <CustomIcon name="addNew" />
        <CustomIcon name="addNewSolid" />
        <CustomIcon name="alertSolid" />
        <CustomIcon name="arrowLeft" />
        <CustomIcon name="arrowRight" />
        <CustomIcon name="arrowUp" />
        <CustomIcon name="arrowDown" />
        <CustomIcon name="bookmark" />
        <CustomIcon name="bookmarkSolid" />
        <CustomIcon name="check" />
        <CustomIcon name="checkCircle" />
        <CustomIcon name="chevronLeft" />
        <CustomIcon name="chevronRight" />
        <CustomIcon name="chevronUp" />
        <CustomIcon name="chevronDown" />
        <CustomIcon name="close" />
        <CustomIcon name="closeCircle" />
      </Flex>
      <Flex>
        <CustomIcon name="connect" />
        <CustomIcon name="contract" />
        <CustomIcon name="contractSolid" />
        <CustomIcon name="contractAddress" />
        <CustomIcon name="contractAddressSolid" />
        <CustomIcon name="contractList" />
        <CustomIcon name="copy" />
        <CustomIcon name="code" />
        <CustomIcon name="copySolid" />
        <CustomIcon name="delete" />
        <CustomIcon name="deleteSolid" />
        <CustomIcon name="deligate" />
        <CustomIcon name="disconnect" />
        <CustomIcon name="document" />
        <CustomIcon name="documentSolid" />
        <CustomIcon name="doubleChevronLeft" />
        <CustomIcon name="download" />
        <CustomIcon name="edit" />
        <CustomIcon name="editSolid" />
        <CustomIcon name="envelope" />
        <CustomIcon name="envelopeSolid" />
        <CustomIcon name="execute" />
        <CustomIcon name="external" />
        <CustomIcon name="feedback" />
        <CustomIcon name="feedbackSolid" />
        <CustomIcon name="folder" />
        <CustomIcon name="folderSolid" />

        <CustomIcon name="home" />
        <CustomIcon name="history" />
      </Flex>
      <Flex>
        <CustomIcon name="infoCircle" />
        <CustomIcon name="instantiate" />
        <CustomIcon name="migrate" />
        <CustomIcon name="minus" />
        <CustomIcon name="more" />
        <CustomIcon name="plus" />
        <CustomIcon name="proposal" />
        <CustomIcon name="proposalSolid" />
        <CustomIcon name="query" />
        <CustomIcon name="redo" />
        <CustomIcon name="saveDocument" />
        <CustomIcon name="saveDocumentSolid" />
        <CustomIcon name="search" />
        <CustomIcon name="searchNotFound" />
        <CustomIcon name="send" />
        <CustomIcon name="sendSolid" />
        <CustomIcon name="submitProposal" />
        <CustomIcon name="swap" />
        <CustomIcon name="vote" />
        <CustomIcon name="voteSolid" />
        <CustomIcon name="upload" />
        <CustomIcon name="uploadCloud" />
        <CustomIcon name="wallet" />
        <CustomIcon name="walletSolid" />
        <CustomIcon name="website" />
      </Flex>
      <RecentActivities />
      {/* <PastTransaction /> */}
    </Box>
  );
};

export default Home;
