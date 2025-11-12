import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatContainer from "../components/ChatContainer.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TutorialCard from "../components/TutorialCard.jsx";

const Home = () => {
  const {
    selectedUser,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  } = useChatStore();

  // Component mount olduğunda bildirimlere abone ol
  useEffect(() => {
    subscribeToNotifications();

    // Cleanup: Component unmount olduğunda aboneliği iptal et
    return () => {
      unsubscribeFromNotifications();
    };
  }, [subscribeToNotifications, unsubscribeFromNotifications]);

  return (
    <div className="h-screen bg-base-200">
      {/* Tutorial Card - İlk girişte gösterilir */}
      <TutorialCard />

      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
