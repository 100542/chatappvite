import { useRef, useEffect, useState } from "react";
import NavBar from "./Nav";
import CompanyData from "../data/network.json";
import axios from "axios";
import { io } from "socket.io-client";
import Login from "./UserRegistration";

const fetchAPI = async () => {
  await axios.get("http://localhost:8080");
};

export default function Network() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    });

    return () => clearInterval(interval);
  });

  useEffect(() => {
    fetchAPI();
    const socketHost = io("http://localhost:8080");
    setSocket(socketHost);

    return () => {
      if (socketHost) socketHost.close();
    };
  }, []);

  useEffect(() => {
    if (selectedRoom && socket && username) {
      socket.emit("join-room", selectedRoom);
      socket.on("receive-message", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: data.sender,
            message: data.message,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
          },
        ]);
      });
      socket.emit("chat-history", selectedRoom);
      socket.on("chat-history", (history) => {
        setMessages(history);
      });

      return () => {
        socket.emit("leave-room", selectedRoom);
        setMessages([]);
      };
    }
  }, [selectedRoom, socket, username]);

  const handleRoomClick = (selectedRoom) => {
    setSelectedRoom(selectedRoom);
  };

  const handleSendMessage = (message) => {
    if (message.trim() && selectedRoom && socket) {
      const timestamp = new Date();
      socket.emit("send-message", {
        room: selectedRoom,
        message,
        sender: username,
        timestamp,
      });
    }
  };

  if (!username) {
    return <Login onAuth={setUsername} />;
  }

  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center items-center h-full w-full absolute z-10">
        <div id="selector" className="block">
          <h1 className="text-4xl lg:text-8xl text-center font-bold">
            Aurelia's Marketplaces
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {CompanyData.data.map((company, index) => (
              <div
                key={index}
                className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center"
              >
                <p className="text-md text-center lg:text-2xl font-light">
                  {company.companyName}
                </p>
                <button
                  className="text-sm mt-2 hover:bg-[#E1C09D] hover:scale-110 duration-500 border-2 border-[#E1C09D] p-2 rounded-md text-black"
                  onClick={() =>
                    handleRoomClick(company.companyName.replace(/\s+/g, ""))
                  }
                >
                  View Chat
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedRoom && (
          <div
            ref={chatBoxRef}
            className="absolute bg-white border-2 border-[#E1C09D] p-4 shadow-lg z-50 right-10 bottom-10 w-[400px] h-[400px]"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">
                Chatting in: {selectedRoom}
              </h2>
              <button
                className="text-red-500 hover:underline hover:cursor-pointer"
                onClick={() => setSelectedRoom(null)}
              >
                Close
              </button>
            </div>
            <div className="overflow-y-scroll h-64 mb-4">
              {messages.map((msg, index) => {
                const msgTime = new Date(msg.timestamp);
  
                const isValidTimestamp = !isNaN(msgTime.getTime());
              
                let formattedTime;
                
                if (isValidTimestamp) {
                  const hours = msgTime.getHours().toString().padStart(2, "0");
                  const minutes = msgTime.getMinutes().toString().padStart(2, "0");
                  const seconds = msgTime.getSeconds().toString().padStart(2, "0");
                  formattedTime = `${hours}:${minutes}:${seconds}`;
                } else {
                  formattedTime = "A while ago...";
                }

                return (
                  <div key={index} className="p-2">
                    <p className="text-sm">
                      <strong className="font-light mr-4 opacity-55">
                        {formattedTime}
                      </strong>
                      <strong>{msg.sender}:</strong> {msg.message}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex">
              <input
                type="text"
                className="p-2 border-2 border-[#E1C09D] rounded-l-md w-full"
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="p-2 bg-[#E1C09D] text-white rounded-r-md"
                onClick={() =>
                  handleSendMessage(document.querySelector("input").value)
                }
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
