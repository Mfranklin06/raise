'use client'
import React, { useState } from "react";
import connectToMqttBroker from "../components/MqttConectionPorta";

export default function Portas() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDoor = () => {
        setIsOpen(!isOpen);
    }
    return (

        <main className="flex flex-col justify-center py-4 min-h-screen bg-background text-foreground">
            <div className="flex justify-center mt-20" id="inicial">
                <h1>Bem-Vindo a sala de portas</h1>
            </div>

            <section className="bg-card rounded-2xl shadow-lg p-6 sm:p-10 mt-10 mx-auto">


                <div className="flex flex-col sm:items-center sm:justify-between items-center gap-8">
                    <h1 className="justify-center">abra ou feche sua porta</h1>

                    <button className="w-64" onClick={() => { toggleDoor(); connectToMqttBroker(isOpen ? 'fechada' : 'aberta') }}>{isOpen ? 'fechar' : 'abrir'}</button>
                </div>
            </section>
        </main>

    );
}


