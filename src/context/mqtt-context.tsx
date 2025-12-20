"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import mqtt, { MqttClient } from "mqtt";

interface MqttContextType {
    client: MqttClient | null;
    isConnected: boolean;
    publish: (topic: string, message: string) => void;
    subscribe: (topic: string) => void;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export function MqttProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef<MqttClient | null>(null);

    useEffect(() => {
        const brokerUrl = process.env.NEXT_PUBLIC_MQTT_URL;

        if (!brokerUrl) {
            console.warn("MQTT URL not defined in env variables (NEXT_PUBLIC_MQTT_URL)");
            return;
        }

        console.log("Connecting to MQTT broker...");
        const client = mqtt.connect(brokerUrl);
        clientRef.current = client;

        client.on("connect", () => {
            console.log("MQTT Connected");
            setIsConnected(true);
        });

        client.on("error", (err) => {
            console.error("MQTT Connection Error:", err);
            setIsConnected(false);
        });

        client.on("offline", () => {
            console.log("MQTT Offline");
            setIsConnected(false);
        });

        client.on("reconnect", () => {
            console.log("MQTT Reconnecting...");
        });

        return () => {
            console.log("Closing MQTT connection");
            client.end();
        };
    }, []);

    const publish = (topic: string, message: string) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish(topic, message, (err) => {
                if (err) {
                    console.error(`Failed to publish to ${topic}:`, err);
                } else {
                    console.log(`Published to ${topic}: ${message}`);
                }
            });
        } else {
            console.warn("MQTT Client not connected. Cannot publish.");
        }
    };

    const subscribe = (topic: string) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.subscribe(topic, (err) => {
                if (err) console.error(`Failed to subscribe to ${topic}:`, err);
                else console.log(`Subscribed to ${topic}`);
            });
        }
    };

    return (
        <MqttContext.Provider value={{ client: clientRef.current, isConnected, publish, subscribe }}>
            {children}
        </MqttContext.Provider>
    );
}

export function useMqtt() {
    const context = useContext(MqttContext);
    if (context === undefined) {
        throw new Error("useMqtt must be used within a MqttProvider");
    }
    return context;
}
