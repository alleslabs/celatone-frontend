import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { StorageKeys } from "lib/data";
import { useLocalStorage } from "lib/hooks";

import { AnnouncementModal } from "./components/AnnouncementModal";
import { HomeFull } from "./full";
import { HomeLite } from "./lite";
import { HomeSequencer } from "./sequencer";

const Home = () => {
  const router = useRouter();
  const [hasVisited, setHasVisited] = useLocalStorage(
    StorageKeys.Annoucement,
    false
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      track(AmpEvent.TO_OVERVIEW);

      if (!hasVisited) {
        setShowModal(true);
        setHasVisited(true);
      }
    }
  }, [router.isReady, hasVisited, setHasVisited]);

  return (
    <>
      <AnnouncementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <TierSwitcher
        full={<HomeFull />}
        sequencer={<HomeSequencer />}
        lite={<HomeLite />}
      />
    </>
  );
};

export default Home;
