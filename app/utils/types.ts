interface Room {
    party_code: string;
    room_password?: string;
    is_locked: boolean;
    name: string;
    status: string;
}

interface RoomContextType {
    allRooms: Room[];
    roomDetail: Room | null;
    loadingRoom: boolean;
    setRoomDetail: (room: Room) => void;
    user: User | null;
    setUser: (user: User) => void;
}

interface User {
    id: string;
    username: string;
    score: number;
    party_code: number;
}

interface UserContextType {
    allUsers: User[];
    userDetail: User | null;
    loadingUser: boolean;
}

export type { Room, User, RoomContextType, UserContextType };
