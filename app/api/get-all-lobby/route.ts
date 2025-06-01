import { supabase } from "@/app/utils/supabase";

export async function GET() {
    const { data: rooms, error } = await supabase
        .from("rooms")
        .select("name, status, party_code, is_locked");
    if (error) throw Error(error.message);

    return new Response(JSON.stringify(rooms));
}
