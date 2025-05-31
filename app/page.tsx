"use client";

import React from "react";
import { extend } from "@react-three/fiber";
import { Water } from "three-stdlib";
import Game from "./scene/Game";

extend({ Water });

export default function Home() {
    return (
        <div className="w-screen h-screen">
            <Game />
        </div>
    );
}
