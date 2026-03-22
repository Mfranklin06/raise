'use client';
import mqtt, { MqttClient } from "mqtt";
import { useEffect, useRef } from "react";

const url = "ws://broker.emqx.io:8083/mqtt";


export default function Portas() {

        const clientRef = useRef<MqttClient | null>(null);

        useEffect(() => {
                const client = mqtt.connect(url);

                client.on("connect", () => {
                        console.log("Conectado ao MQTT");
                        client.subscribe("porta/lab_pesquisa");
                });

                clientRef.current = client;

                return () => {
                        client.end();
                };
        }, []);

        function enviarAberta() {
                if (clientRef.current) {
                        clientRef.current.publish("porta/lab_pesquisa", "aberta");
                }
        }

        return (
                <main className="bg-background flex justify-center items-center min-h-screen p-4">
                        <div className="bg-card text-card-foreground flex flex-col items-center w-full max-w-md h-64 border border-gray-400 rounded p-6">
                                <h1>Porta do Lab de Pesquisa</h1>
                                <div className="flex flex-1 justify-center items-center">
                                        <button onClick={enviarAberta} className="bg-secondary text-secondary-foreground px-6 py-3 rounded-2xl hover:bg-primary-strong hover:text-primary-foreground transition">
                                                Abrir Porta
                                        </button>
                                </div>
                        </div>
                </main>
        );
}

