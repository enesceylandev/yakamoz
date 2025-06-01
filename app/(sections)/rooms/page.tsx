"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog"; // DialogTrigger'ı kaldırdık
import { useRoomContext } from "@/app/context/roomContext";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Room } from "@/app/utils/types";
import { JoinDialog } from "@/components/JoinDialog";

const Lobby = () => {
    const { allRooms } = useRoomContext();
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [open, setOpen] = useState(false);

    const handleRowClick = (room: Room) => {
        setSelectedRoom(room);
        setOpen(true);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Party Code</TableHead>
                        <TableHead>Room Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Locked</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allRooms.map((room) => (
                        <TableRow
                            key={room.party_code}
                            className="cursor-pointer"
                            onClick={() => handleRowClick(room)}
                        >
                            <TableCell>{room.party_code}</TableCell>
                            <TableCell>{room.name}</TableCell>
                            <TableCell>{room.status}</TableCell>
                            <TableCell className="text-right">
                                {room.is_locked ? "🔒" : "🔓"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onOpenChange={setOpen}>
                {selectedRoom && <JoinDialog room={selectedRoom} />}
            </Dialog>
        </>
    );
};

export default Lobby;
