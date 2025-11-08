// frontend/src/components/Sidebar.jsx

import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  // Hem online kullanıcı listesini hem de mevcut giriş yapmış kullanıcıyı alıyoruz
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Giriş yapmış kullanıcıyı kenar çubuğunda göstermemek için filtreleme
  // users may sometimes be non-array due to unexpected API shape; guard defensively
  const usersArray = Array.isArray(users) ? users : [];
  const currentUserId = authUser && authUser._id ? authUser._id : null;

  const usersToDisplay = usersArray.filter(
    (user) => user._id !== currentUserId
  );

  const filteredUsers = showOnlineOnly
    ? usersToDisplay.filter(
        (user) => Array.isArray(onlineUsers) && onlineUsers.includes(user._id)
      )
    : usersToDisplay;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Kişiler</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Sadece çevrimiçi</span>
          </label>

          {/* DÜZELTME: Kendimiz hariç online olanların sayısını güvenli bir şekilde hesaplıyoruz */}
          <span className="text-xs text-base-content/60">
            (
            {Array.isArray(onlineUsers)
              ? onlineUsers.filter((id) => id !== currentUserId).length
              : 0}{" "}
            çevrimiçi)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-base-100"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-base-content/70">
                {onlineUsers.includes(user._id) ? "Çevrimiçi" : "Çevrimdışı"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/60 py-4 text-sm">
            Gösterilecek kullanıcı yok.
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
