'use client'
import mqtt from 'mqtt';

const url = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || '';
if (!url) {
  console.error("ERRO: A variável de ambiente NEXT_PUBLIC_MQTT_BROKER_URL não está definida.");
}

// Atualizei a tipagem baseada nas colunas do seu Banco de Dados
type Unidade = {
  id: number | string;
  name?: string;
  nome?: string;
  // Campos vindos do seu DB (conforme seu print anterior)
  current_temperatura?: number;
  current_modo?: string;
  current_ventilacao?: string;
};

export async function MqttEnvioDeJson(id: number | string) {
  try {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      console.warn('MqttEnvioDeJson: id inválido:', id);
      return;
    }

    // 1. Busca os dados atualizados da sala (que você acabou de salvar no DB)
    const res = await fetch('/api/salas/');
    if (!res.ok) {
      console.error('Falha ao buscar /api/salas:', res.status);
      return;
    }

    const data = await res.json();
    const list: Unidade[] = Array.isArray(data) ? data : Array.isArray(data?.salas) ? data.salas : [];

    const unidade = list.find(u => Number(u.id) === numericId);

    if (!unidade) {
      console.warn(`Unidade com id=${numericId} não encontrada.`);
      return;
    }

    // 2. Monta o Payload Limpo (Tradução DB -> JSON padrão da IA)
    // O DB usa "current_temperatura", mas a IA espera "temp"

    let estadoAtual = "ON";
    // Se o modo no banco for "desligado", avisamos a IA que é para desligar
    if (unidade.current_modo === 'desligado' || unidade.current_modo === 'OFF') {
      estadoAtual = "OFF";
    }

    const payload = {
      unidade_id: numericId,
      temp: unidade.current_temperatura || 23, // Fallback para 23 se vier nulo
      mode: unidade.current_modo || 'cool',
      fan: unidade.current_ventilacao || 'high',
      estado: estadoAtual
    };

    console.log('Enviando Payload JSON:', payload);

    // 3. Conecta e Envia
    const client = mqtt.connect(url);
    const topicoDestino = "teste_mqtt/Ar_pesquisa"; // O tópico que o Python escuta

    client.on('connect', () => {
      // Publica o JSON transformado em String
      client.publish(topicoDestino, JSON.stringify(payload), () => {
        console.log(`Sucesso! JSON enviado para ${topicoDestino}`);
        client.end(); // Fecha conexão logo após enviar
      });
    });

    client.on('error', (err) => {
      console.error('MQTT error:', err);
      client.end();
    });

  } catch (err) {
    console.error('MqttEnvioDeJson erro:', err);
  }
}