"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Room, RoomContextType, User } from "../utils/types";
import axios from "axios";

const RoomContext = createContext<RoomContextType | null>(null);

interface RoomProviderProps {
  children: ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [roomDetail, setRoomDetail] = useState<Room | null>(null);
  const [loadingRoom, setLoadingRoom] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRooms() {
      const response = await axios.get("/api/get-all-lobby");
      if (response.status !== 200) throw Error(response.statusText);
      setLoadingRoom(false);
      setAllRooms(response.data);
    }

    fetchRooms();
  }, []);

  return (
    <RoomContext.Provider
      value={{
        allRooms,
        roomDetail,
        loadingRoom,
        setRoomDetail,
        user,
        setUser,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export function useRoomContext(): RoomContextType {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
}
