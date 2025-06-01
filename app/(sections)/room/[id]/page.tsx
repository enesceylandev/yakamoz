"use client";

import { useRoomContext } from "@/app/context/roomContext";
import { supabase } from "@/app/utils/supabase";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function RoomPage() {
    const { user, setUser } = useRoomContext();
    const [players, setPlayers] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        const channel = supabase.channel("players");

        channel
            .on("presence", { event: "sync" }, () => {
                const presenceState = channel.presenceState();
                const mergedPlayers = Object.values(presenceState).flat();
                setPlayers(mergedPlayers);
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        id: user.id,
                        username: user.username,
                        party_code: user.party_code,
                        score: user.score,
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [user]);

    const handleScor = () => {
        if (!user) return;
        setUser({ ...user, score: user.score + 1 });
    };
    return (
        <div>
            <h1>Oda:</h1>
            <h2>Oyuncular:</h2>

            <Button onClick={() => console.log(players)}>Gönder</Button>
            <Button onClick={() => handleScor()}>Skor Arttır</Button>
            <ul>
                {players.map((p, index) => (
                    <li key={index}>{p.username}</li>
                ))}
            </ul>
        </div>
    );
}
