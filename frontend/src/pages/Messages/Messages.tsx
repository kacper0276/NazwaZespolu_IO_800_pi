import React, { useState, useEffect } from "react";
import styles from "./Messages.module.scss";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { apiJson } from "../../config/api";
import { ApiResponse } from "../../types/api.types";
import { UserType } from "../../types/IUser";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import WebSocketService from "../../services/webSocket.service";
import localStorageService from "../../services/localStorage.service";

const Messages: React.FC = () => {
  useWebsiteTitle("Wiadomości");
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [debouncedUsername, setDebouncedUsername] = useState<string>("");
  const [results, setResults] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [message, setMessage] = useState<string>("");
  const userData: UserType | null = localStorageService.getItem("user");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [username]);

  useEffect(() => {
    if (debouncedUsername.trim()) {
      fetchUsers(debouncedUsername);
    } else {
      setResults([]);
    }
  }, [debouncedUsername]);

  const fetchUsers = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await apiJson.get<ApiResponse<UserType[]>>(
        "users/search",
        {
          params: { query },
        }
      );

      const users = response.data.data ?? [];
      setResults(users);
    } catch (error) {
      toast.error(t("error-fetching-users"));
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      WebSocketService.sendMessage(username, message, room);
      setMessage("");
    }
  };

  useEffect(() => {
    if (selectedUser) {
      WebSocketService.onMessage((msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }
  }, [selectedUser]);

  return (
    <div className={`${styles.mainContainer} container-fluid`}>
      <div className={styles.containerHeader}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Szukaj użytkownika"
        />
      </div>

      {(debouncedUsername || isLoading) && (
        <div className={styles.resultsContainer}>
          {isLoading && <p>Ładowanie wyników...</p>}
          {!isLoading && results.length === 0 && debouncedUsername && (
            <p>Brak wyników dla "{debouncedUsername}"</p>
          )}
          <ul>
            {results.map((user) => (
              <li
                key={user._id}
                className={styles.resultItem}
                onClick={() => startChat(user)}
              >
                <strong>{user.email}</strong> - {user.firstname} {user.lastname}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedUser && (
        <div className={styles.chatContainer}>
          <div className={styles.messagesContainer}>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>
                  <strong>{msg.sender}:</strong> {msg.message}
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
