import { supabase } from "@/app/utils/supabase";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { party_code, username, room_password } = body;

    if (!party_code || !username) {
        return new Response(
            JSON.stringify({ error: "party_code and player_name are required." }),
            { status: 400 },
        );
    }

    const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select("*")
        .eq("party_code", party_code)
        .single();

    if (roomError || !room) {
        return new Response(JSON.stringify({ error: "Room not found." }), {
            status: 404,
        });
    }

    if (room.is_locked) {
        if (!room_password) {
            return new Response(
                JSON.stringify({ error: "Room is locked. Password required." }),
                {
                    status: 401,
                },
            );
        }

        if (room.room_password !== room_password) {
            return new Response(
                JSON.stringify({ error: "Incorrect room password." }),
                {
                    status: 403,
                },
            );
        }
    }

    return new Response(JSON.stringify({ message: "Joined lobby.", room }), {
        status: 200,
    });
}
