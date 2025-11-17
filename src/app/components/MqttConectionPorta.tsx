import mqtt from 'mqtt';

export default function connectToMqttBroker(mensagem: string) {
    const url = 'wss://broker.emqx.io:8084/mqtt';

    const client = mqtt.connect(url);

    client.on('connect', () => {
      client.subscribe("lab_pesquisa", (err) => {
        if (err) console.error('Erro subscribe:', err);
      });
      client.publish("porta/lab_pesquisa", mensagem);
      
      client.end();
    });

    client.on('error', (err) => {
      console.error('MQTT error:', err);
      client.end();
    });
}