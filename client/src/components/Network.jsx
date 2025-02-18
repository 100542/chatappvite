import NavBar from "./Nav";
import CompanyData from "../data/network.json";
import axios from "axios";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const fetchAPI = async () => {
  await axios.get("http://localhost:8080");
};

export default function Network() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchAPI();

    const socketHost = io("http://localhost:8080");
    setSocket(socketHost);

    return () => {
      if (socketHost) socketHost.close();
    };
  }, []);

  useEffect(() => {
    if (selectedRoom && socket) {
      socket.emit("join-room", selectedRoom);

      let username = window.prompt("Enter a name to chat with:")

      if (!username) {
        window.alert("Username may not be empty, try again.")
        location.reload()
      }

      socket.on("receive-message", (message) => {
        setMessages((prevMessages) => [...prevMessages, username + ": " + message]);
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
  }, [selectedRoom, socket]);

  const handleRoomClick = (selectedRoom) => {
    console.log("Room:", selectedRoom);
    setSelectedRoom(selectedRoom);
  };

  const handleSendMessage = (message) => {
    if (message.trim() && selectedRoom && socket) {
      socket.emit("send-message", { room: selectedRoom, message });
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center items-center h-full w-full absolute z-10">
        <div id="selector" className="block">
          <h1 className="text-4xl lg:text-8xl font-bold [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]">
            Aurelia's Public Channels
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {CompanyData.data.map((company, index) => (
              <div
                key={index}
                className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center"
              >
                <p className="text-md text-center lg:text-2xl font-light [text-shadow:_0_2px_4px_rgba(0,0,0,0.2)]">
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
          <div className="w-full mt-6 p-4 border-t-2 bg-white/90 border-[#E1C09D]">
            <h2 className="text-2xl font-semibold mb-4">
              Currently chatting in: {selectedRoom}
            </h2>

            <div className="h-64 overflow-y-scroll mb-4">
              {messages.map((msg, index) => (
                <div key={index} className="p-2">
                  <p className="text-sm">{msg}</p>
                </div>
              ))}
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
