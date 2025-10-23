'use client'
import mqtt from 'mqtt';

const url = 'wss://broker.emqx.io:8084/mqtt';

type Unidade = {
  id: number | string;
  name?: string;
  nome?: string;
  current_raw_code?: string;
  raw_code?: string;
  raw?: string;
};

export async function MqttEnvioDeRaw(id: number | string) {
  try {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      console.warn('MqttEnvioDeRaw: id inválido:', id);
      return;
    }

    const res = await fetch('/api/salas/');
    if (!res.ok) {
      console.error('Falha ao buscar /api/salas:', res.status);
      return;
    }

    const data = await res.json();
    // normaliza caso a API retorne { salas: [...] } ou um array direto
    const list: Unidade[] = Array.isArray(data) ? data : Array.isArray(data?.salas) ? data.salas : [];

    console.log('dados recebidos:', data);

    const unidade = list.find(u => Number(u.id) === numericId);

    if (!unidade) {
      console.warn(`Unidade com id=${numericId} não encontrada.`);
      return;
    }

    const nome = unidade.name ?? unidade.nome;
    const raw = unidade.current_raw_code ?? unidade.raw_code ?? unidade.raw;

    if (!nome || !raw) {
      console.warn('Campos faltando na unidade:', unidade);
      return;
    }

    const client = mqtt.connect(url);

    client.on('connect', () => {
      client.subscribe(String(nome), (err) => {
        if (err) console.error('Erro subscribe:', err);
      });
      client.publish("teste_mqtt/"+String(nome), String(raw), () => {
        console.log(`Publicado no tópico teste_mqtt/${nome}: ${raw}`);
      });
      
      client.publish("teste_mqtt/"+String(nome), "=$o$u$t$=", () => {
        console.log(`Publicado no tópico teste_mqtt/${nome}: =$o$u$t$=`);
        client.end();
      });
    });

    client.on('error', (err) => {
      console.error('MQTT error:', err);
      client.end();
    });

  } catch (err) {
    console.error('MqttEnvioDeRaw erro:', err);
  }
}
