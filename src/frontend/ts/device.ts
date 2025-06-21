
class Device {
  id: number;
  name: string;
  description: string;
  // 0: lámpara, 1: ventana
  type: number; 
  // AHORA es un float
  state: number;

  constructor(id: number, name: string, description: string, type: number, state: number) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.type = type;
      this.state = state;
  }
}
