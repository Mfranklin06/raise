import { useMqtt } from "@/context/mqtt-context";
import { useCallback } from "react";
// Import UnidadeAC if possible, or define a compatible interface
import { UnidadeAC } from "@/lib/data";

export function useMqttControl() {
    const { publish, isConnected } = useMqtt();

    const sendRaw = useCallback((unidade: UnidadeAC) => {
        if (!isConnected) {
            console.warn("MQTT not connected, cannot send RAW command.");
            return;
        }

        const nome = unidade.name ?? unidade.nome;
        const raw = unidade.current_raw_code ?? unidade.raw_code ?? unidade.raw;

        if (!nome || !raw) {
            console.warn("Missing name or raw code in unit:", unidade);
            return;
        }

        const topic = `teste_mqtt/${nome}`;

        // Publish raw code
        console.log(`Sending RAW to ${topic}: ${raw}`);
        publish(topic, String(raw));

        // Send the termination signal after 500ms
        setTimeout(() => {
            console.log(`Sending OUT signal to ${topic}`);
            publish(topic, "=$o$u$t$=");
        }, 500);

    }, [isConnected, publish]);

    return { sendRaw };
}
