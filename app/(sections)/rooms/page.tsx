"use client"

import React, { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { useRoomContext } from "@/app/context/roomContext"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Room } from "@/app/utils/types"
import { JoinDialog } from "@/components/JoinDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Unlock } from "lucide-react"

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Aktif":
      return "default"
    case "Dolu":
      return "destructive"
    case "Beklemede":
      return "secondary"
    case "Boş":
    case "waiting":
      return "outline"
    default:
      return "secondary"
  }
}

const Lobby = () => {
  const { allRooms } = useRoomContext()
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [open, setOpen] = useState(false)

  const handleRowClick = (room: Room) => {
    setSelectedRoom(room)
    setOpen(true)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lobi Odaları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Party Code</TableHead>
                  <TableHead className="font-semibold">Oda İsmi</TableHead>
                  <TableHead className="font-semibold">Durum</TableHead>
                  <TableHead className="text-right font-semibold">Kilit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRooms.map((room) => (
                  <TableRow
                    key={room.party_code}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleRowClick(room)}
                  >
                    <TableCell className="font-mono font-medium">{room.party_code}</TableCell>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(room.status)}>{room.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {room.is_locked ? (
                        <Lock className="h-4 w-4 text-muted-foreground inline" />
                      ) : (
                        <Unlock className="h-4 w-4 text-muted-foreground inline" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        {selectedRoom && <JoinDialog room={selectedRoom} />}
      </Dialog>
    </div>
  )
}

export default Lobby
