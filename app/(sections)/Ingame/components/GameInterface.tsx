import { useRoomContext } from '@/app/context/roomContext';
import React from 'react'

import { User, PlayerPresence } from "@/app/utils/types";
import { supabase } from "@/app/utils/supabase";
import { useEffect, useState } from "react";

const GameInterface = () => {
    const { user } = useRoomContext();
    const [players, setPlayers] = useState<PlayerPresence[] | User[]>([]);
    
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

        console.log(players)
  return (
    <div className=" bg-slate-700/20 rounded-md text-white fixed top-5 right-5 z-50 p-3 min-w-[150px]">
        <h1 className="text-xl font-bold py-1 flex justify-center">Leaderboard</h1>
           <ul>
              {[...players]
                .filter((p): p is User => "username" in p)
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <li key={player.id}>
                    {index + 1}. {player.username}({player.score})
                  </li>
                ))}
            </ul>
    </div>
  )
}

export default GameInterface