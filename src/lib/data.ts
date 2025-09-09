const salas = [
  { id: 1, name: "Sala 1", status: "aberto", temperatura: 22, raw: [] },
  { id: 2, name: "Sala 2", status: "fechado", temperatura: 25, raw: [] },
  { id: 3, name: "Sala 3", status: "aberto", temperatura: 20, raw: [] },
];
export const getSalasData = () => {
  return salas;
}