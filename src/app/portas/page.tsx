'use client'
import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import connectToMqttBroker from "../components/MqttConectionPorta";

export default function Portas() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDoor = () => {
        setIsOpen(!isOpen);
    }
    return (
        <>
            <div>
                <h1 className="justify-center">Bem-Vindo a sala de portas</h1>
            </div>
            <main>

                <Box component={"section"} className="flex flex-col justify-center text-center text-4xl space-y-6 py-6 bg-background min-h-screen text-foreground">


                    <div className="space-y-6">
                        <h1 className="justify-center">abra ou feche sua porta</h1>

                        <Button className="w-64" variant="outlined" onClick={() => { toggleDoor(); connectToMqttBroker(isOpen ? 'fechada' : 'aberta') }}>{isOpen ? 'fechar' : 'abrir'}</Button>
                    </div>
                </Box>
            </main>
        </>
    );
}


