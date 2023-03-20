import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "./actions";
import { io } from "socket.io-client";
import "./styles/tailwindComponents.css";

const Chat = ({ username }) => {
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const messages = useSelector((state) => state.messages);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io("http://localhost:8080", {
      auth: {
        token,
      },
    });
    socket.on("loadMessages", (savedMessages) => {
      for (const message of savedMessages) {
        dispatch(addMessage(message));
      }
    });
    socket.on("message", (message) => {
      dispatch(addMessage(message));
      scrollToBottom();
    });
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      const token = localStorage.getItem("token");
      const message = {
        text: input,
        timestamp: new Date().getTime(),
        username: username,
        token,
      };
      socket.emit("message", message, (response) => {
        if (response.status === "success") {
          setInput("");
        } else {
          console.error("Error sending message:", response.error);
        }
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="header">
          <h2>Welcome, {username}</h2>
          <button
            onClick={handleLogout}
            className="logout-button bg-red-500 text-white font-bold rounded-lg px-4 py-2 shadow-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <ul className="message-list">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`message ${
                msg.username !== username ? "other-user" : "current-user"
              }`}
            >
              <span className="username font-bold text-blue-700">
                {msg.username}:
              </span>
              <span className="timestamp text-gray-400 text-xs mr-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              <span className="text text-gray-800">{msg.text}</span>
            </li>
          ))}
          <div ref={messagesEndRef}></div>
        </ul>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            className="input-area__input border border-gray-300 rounded-lg p-2 outline-none"
          />
          <button
            onClick={sendMessage}
            className="input-area__button ml-2 bg-green-500 text-white font-bold rounded-lg px-4 py-2 shadow-md hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
