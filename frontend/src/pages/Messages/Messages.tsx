import React, { useState, useEffect } from "react";
import styles from "./Messages.module.scss";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { useApiJson } from "../../config/api";
import { ApiResponse } from "../../types/api.types";
import { UserType } from "../../types/IUser";
import { useTranslation } from "react-i18next";
import WebSocketService from "../../services/webSocket.service";
import localStorageService from "../../services/localStorage.service";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Messages: React.FC = () => {
  useWebsiteTitle("Wiadomości");
  const { t } = useTranslation();
  const apiJson = useApiJson();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [message, setMessage] = useState<string>("");
  const userData: UserType | null = localStorageService.getItem("user");

  useEffect(() => {
    const userEmail = new URLSearchParams(location.search).get("useremail");

    if (!userEmail) {
      toast.error("User email is missing in query params");
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setIsLoading(true);

        if (selectedUser && userData) {
          const prevRoom = WebSocketService.generateRoomId(
            userData.email,
            selectedUser.email
          );
          WebSocketService.leaveRoom(prevRoom);
        }

        const response = await apiJson.get<ApiResponse<UserType[]>>(
          "users/search",
          {
            params: { query: userEmail },
          }
        );

        const users = response.data.data ?? [];

        if (users.length === 0) {
          toast.error("No user found with this email.");
        } else {
          setMessages([]);
          startChat(users[0]);
        }
      } catch (error) {
        toast.error("Error fetching user data.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [location.search]);

  const startChat = (user: UserType) => {
    setSelectedUser(user);
    if (userData) {
      const room = WebSocketService.generateRoomId(userData.email, user.email);
      WebSocketService.joinRoom(room);
    }
  };

  const sendMessage = () => {
    if (message.trim() && selectedUser && userData) {
      const room = WebSocketService.generateRoomId(
        userData.email,
        selectedUser.email
      );
      WebSocketService.sendMessage(
        userData.email,
        selectedUser.email,
        message,
        room
      );

      setMessage("");
    }
  };

  useEffect(() => {
    if (selectedUser) {
      WebSocketService.onMessage((msg) => {
        console.log(msg);

        setMessages((prevMessages) => [
          ...prevMessages,
          ...(Array.isArray(msg) ? msg : [msg]),
        ]);
      });
    }
  }, [selectedUser]);

  if (isLoading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className={`${styles.mainContainer} container-fluid`}>
      {selectedUser && (
        <div className={styles.chatContainer}>
          <div className={styles.messagesContainer}>
            <ul>
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={
                    msg.sender === userData?.email
                      ? styles.myMessage
                      : styles.otherMessage
                  }
                >
                  <strong>
                    {msg.sender === userData?.email ? "You" : msg.sender}:
                  </strong>{" "}
                  {msg.message}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.messageInput}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("type-message")}
            />
            <button onClick={sendMessage}>{t("send")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
