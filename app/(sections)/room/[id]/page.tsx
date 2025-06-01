"use client"

import { useRoomContext } from "@/app/context/roomContext"
import { supabase } from "@/app/utils/supabase"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Room, PlayerPresence, User } from "@/app/utils/types"
import Game from "../../Ingame/scene/Game"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function RoomPage() {
  const { user, roomDetail, setRoomDetail } = useRoomContext()
  const [players, setPlayers] = useState<PlayerPresence[] | User[]>([])

  useEffect(() => {
    if (!user) return

    const channel = supabase.channel("players")

    channel
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState()
        const mergedPlayers = Object.values(presenceState).flat()
        setPlayers(mergedPlayers)
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id: user.id,
            username: user.username,
            party_code: user.party_code,
            score: user.score,
          })
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  useEffect(() => {
    const subscription = supabase
      .channel("rooms")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        (payload) => {
          setRoomDetail(payload.new as Room)
          console.log("Change received!", payload)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  const updateGameDetail = async (newStatus: string) => {
    if (!roomDetail) return

    const { data, error } = await supabase
      .from("rooms")
      .update({ status: newStatus })
      .eq("party_code", roomDetail.party_code)
      .select()

    if (error) {
      console.error("Oda güncellenirken hata oluştu:", error.message)
    } else {
      console.log("Oda güncellendi:", data)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "started":
        return "default"
      case "waiting":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (roomDetail?.status === "waiting") {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{roomDetail.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-sm text-muted-foreground">Party Code:</div>
              <div className="font-mono font-medium">{roomDetail.party_code}</div>
              <div className="mt-2">
                <Badge variant={getStatusVariant(roomDetail.status)}>{roomDetail.status}</Badge>
              </div>
            </div>

            <div className="rounded-md border mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Oyuncular</TableHead>
                    <TableHead className="font-semibold">Skor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((p, index) =>
                    "username" in p ? (
                      <TableRow key={index}>
                        <TableCell>{p.username}</TableCell>
                        <TableCell>{p.score}</TableCell>
                      </TableRow>
                    ) : null
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() =>
                  updateGameDetail(roomDetail.status === "waiting" ? "started" : "waiting")
                }
              >
                Oyunu Başlat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (roomDetail?.status === "started") {
    return (
      <div className="w-screen h-screen">
        <Game />
      </div>
    )
  }

  return null
}
