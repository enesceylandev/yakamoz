import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Room } from "@/app/utils/types";
import { useState } from "react";
import axios from "axios";
import { useRoomContext } from "@/app/context/roomContext";
import { useRouter } from "next/navigation";

export function JoinDialog({ room }: { room: Room }) {
    const { setUser, setRoomDetail } = useRoomContext();
    const router = useRouter();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleSubmit = async () => {
        try {
            const response = await axios.post("/api/join-lobby", {
                party_code: room.party_code,
                username: form.username,
                room_password: form.password,
            });
            console.log(response.data, {
                party_code: Number(room.party_code),
                username: form.username,
                score: 0,
                id: Math.floor(Math.random() * 100000).toString(),
            });
            setUser({
                party_code: Number(room.party_code),
                username: form.username,
                score: 0,
                id: Math.floor(Math.random() * 100000).toString(),
            });
            setRoomDetail(response.data.room);
            router.push("/room/" + room.party_code);
        } catch (error: unknown) {
            console.error("Katılım hatası:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Katılım sırasında hata oluştu.");
        }
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{room.name} odasına katıl</DialogTitle>
                <DialogDescription>
                    Bu oda {room.is_locked ? "şifreli" : "herkese açık"}.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="name">Adınız</Label>
                    <Input
                        id="name"
                        name="name"
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        value={form.username}
                        type="text"
                        placeholder="Adınız"
                    />
                </div>
                {room.is_locked && (
                    <div className="grid gap-3">
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                            id="password"
                            name="password"
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            value={form.password}
                            type="password"
                            placeholder="Oda şifresi"
                        />
                    </div>
                )}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Vazgeç</Button>
                </DialogClose>
                <Button onClick={() => handleSubmit()}>Katıl</Button>
            </DialogFooter>
        </DialogContent>
    );
}
