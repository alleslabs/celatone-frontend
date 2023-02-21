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
        <CustomIcon name="admin" />
        <CustomIcon name="adminClear" />
        <CustomIcon name="adminClearSolid" />
        <CustomIcon name="adminEdit" />
        <CustomIcon name="adminLock" />
        <CustomIcon name="adminLockSolid" />
        <CustomIcon name="addNew" />
        <CustomIcon name="addNewSolid" />
        <CustomIcon name="alertSolid" viewBox="0.5 0.5 16 16" />
        <CustomIcon name="arrowLeft" viewBox="-2 -2 16 16" />
        <CustomIcon name="arrowRight" viewBox="-2 -2 16 16" />
        <CustomIcon name="arrowUp" viewBox="-2 -2 16 16" />
        <CustomIcon name="arrowDown" viewBox="-2 -2 16 16" />
        <CustomIcon name="bookmark" viewBox="-1 0 16 16" />
        <CustomIcon name="bookmarkSolid" viewBox="-1 0 16 16" />
        <CustomIcon name="check" viewBox="0 -2 16 16" />
        <CustomIcon name="checkCircle" />
        <CustomIcon name="chevronLeft" viewBox="-4 -2 16 16" />
        <CustomIcon name="chevronRight" viewBox="-4 -2 16 16" />
        <CustomIcon name="chevronUp" viewBox="-2 -4 16 16" />
        <CustomIcon name="chevronDown" viewBox="-2 -4 16 16" />
        <CustomIcon name="close" viewBox="-2 -2.5 16 16" />
        <CustomIcon name="closeCircle" />
        <CustomIcon name="envelope" viewBox="0 -2 16 16" />
        <CustomIcon name="envelopeSolid" viewBox="0 -2 16 16" />
      </Flex>
      <Flex>
        <CustomIcon name="connect" viewBox="0 -4 16 16" />
        <CustomIcon name="contract" viewBox="-1 0 16 16" />
        <CustomIcon name="contractSolid" viewBox="-1 0 16 16" />
        <CustomIcon name="contractAddress" />
        <CustomIcon name="contractAddressSolid" />
        <CustomIcon name="contractList" viewBox="0 -3 16 16" />
        <CustomIcon name="copy" viewBox="-0.5 0 16 16" />
        <CustomIcon name="copySolid" viewBox="-0.5 0 16 16" />
        <CustomIcon name="delete" viewBox="-1 0 16 16" />
        <CustomIcon name="deleteSolid" viewBox="-1 0 16 16" />
        <CustomIcon name="deligate" />
        <CustomIcon name="disconnect" viewBox="0 -1.5 16 16" />
        <CustomIcon name="document" />
        <CustomIcon name="documentSolid" />
        <CustomIcon name="doubleChevronLeft" viewBox="-1 -2 16 16" />
        <CustomIcon name="download" viewBox="-1 -2 16 16" />
        <CustomIcon name="edit" />
        <CustomIcon name="editSolid" />
        <CustomIcon name="execute" />
        <CustomIcon name="external" />
        <CustomIcon name="feedback" />
        <CustomIcon name="feedbackSolid" />
        <CustomIcon name="folder" viewBox="0 -1 16 16" />
        <CustomIcon name="folderSolid" viewBox="0 -1 16 16" />

        <CustomIcon name="home" />
        <CustomIcon name="history" viewBox="1.5 -0.5 16 16" />
      </Flex>
      <Flex>
        <CustomIcon name="infoCircle" />
        <CustomIcon name="instantiate" />
        <CustomIcon name="migrate" viewBox="0 -1 16 16" />
        <CustomIcon name="minus" viewBox="-2 -7 16 16" />
        <CustomIcon name="more" viewBox="0 -6 16 16" />
        <CustomIcon name="plus" viewBox="-2 -1 16 16" />
        <CustomIcon name="proposal" />
        <CustomIcon name="proposalSolid" />
        <CustomIcon name="query" viewBox=" -1 0 16 16" />
        <CustomIcon name="redo" viewBox="-1 0.5 16 16" />
        <CustomIcon name="saveDocument" viewBox="-1 0 16 16" />
        <CustomIcon name="saveDocumentSolid" viewBox="-1 0 16 16" />
        <CustomIcon name="search" />
        <CustomIcon name="searchNotFound" />
        <CustomIcon name="send" viewBox="0.5 1 16 16" />
        <CustomIcon name="sendSolid" viewBox="0.5 1 16 16" />
        <CustomIcon name="submitProposal" viewBox="0.5 -2.5 16 16" />

        <CustomIcon name="swap" />
        <CustomIcon name="vote" viewBox="0 1 16 16" />
        <CustomIcon name="voteSolid" viewBox="0 1 16 16" />
        <CustomIcon name="upload" viewBox="-1 -2 16 16" />
        <CustomIcon name="uploadCloud" viewBox="0 -2 16 16" />
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
