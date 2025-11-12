import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      // Normalize API response to always set an array on `users`.
      // Some APIs may return { users: [...] } or directly [...]. Handle both.
      const usersPayload = Array.isArray(res.data)
        ? res.data
        : res.data.users || [];
      set({ users: usersPayload });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  // Yeni mesaj bildirimleri için global listener
  subscribeToNotifications: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      const { users } = get();

      // Eğer mesaj şu anda açık olan sohbetten geliyorsa bildirim gösterme
      if (selectedUser && newMessage.senderId === selectedUser._id) return;

      // Mesajı gönderen kullanıcıyı bul
      const sender = users.find((user) => user._id === newMessage.senderId);

      if (sender) {
        // Basit metin bildirimi
        const messagePreview = newMessage.text
          ? newMessage.text.length > 50
            ? `${newMessage.text.substring(0, 50)}...`
            : newMessage.text
          : "📷 Fotoğraf gönderdi";

        toast.success(`${sender.fullName}: ${messagePreview}`, {
          duration: 4000,
          position: "bottom-left",
          icon: "💬",
          style: {
            cursor: "pointer",
          },
          onClick: () => {
            set({ selectedUser: sender });
          },
        });
      }
    });
  },

  unsubscribeFromNotifications: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
