"use client";

import { useState, useRef, use, useEffect } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";
import { useSession } from "next-auth/react";

const Notifications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();
  const notifButtonRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <KnockProvider
      apiKey={"pk_test_YQHc-uti0eSALwCoLyf0dDlriM7eVMKP-oqbEFWdsa0"}
      userId={session?.user?.email ?? ""}
    >
      <KnockFeedProvider feedId={"3db80daf-dc9b-4f35-9412-09537dd7f734"}>
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={(e) => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  ) : (
    <div>Check Notifications</div>
  );
};

export default Notifications;
