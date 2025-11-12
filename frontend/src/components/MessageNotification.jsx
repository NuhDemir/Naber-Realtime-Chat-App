import React from "react";

const MessageNotification = ({ sender, message, profilePic }) => {
  return (
    <div className="flex items-center gap-3 bg-base-100 shadow-xl rounded-lg p-3 max-w-sm border border-base-300">
      {/* Avatar */}
      <div className="avatar">
        <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
            src={profilePic || "/avatar.png"}
            alt={sender}
            className="object-cover"
          />
        </div>
      </div>

      {/* Mesaj İçeriği */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-base-content truncate">
          {sender}
        </p>
        <p className="text-xs text-base-content/70 truncate max-w-[200px]">
          {message?.text && message.text.length > 50
            ? `${message.text.substring(0, 50)}...`
            : message?.text || "Fotoğraf gönderdi"}
        </p>
      </div>

      {/* Görsel varsa küçük önizleme */}
      {message?.image && (
        <div className="w-10 h-10 rounded overflow-hidden">
          <img
            src={message.image}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default MessageNotification;
