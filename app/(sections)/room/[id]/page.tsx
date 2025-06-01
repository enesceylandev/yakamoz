"use client";

import { useRoomContext } from "@/app/context/roomContext";
import { supabase } from "@/app/utils/supabase";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type Player = {
    id: string;
    username: string;
    party_code: number;
    score: number;
};

type PlayerPresence = {
    presence_ref: string;
};

export default function RoomPage() {
    const { user, setUser } = useRoomContext();
    const [players, setPlayers] = useState<PlayerPresence[] | Player[]>([]);

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
                {players.map((p, index) => {
                    if ("username" in p) {
                        return <li key={index}>{p.username}</li>;
                    }
                    return null; // ya da başka fallback
                })}
            </ul>
        </div>
    );
}
