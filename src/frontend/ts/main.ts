
class Main implements EventListenerObject {
    
    handleEvent(event: Event): void {
        const elemento = <HTMLElement>event.target;
       if (elemento.id === "btnCrear" && event.type === "click") {
         
          const name = (document.getElementById("name") as HTMLInputElement).value;
          const description = (document.getElementById("description") as HTMLInputElement).value;
          const type = parseInt((document.getElementById("type") as HTMLSelectElement).value);
          const state = parseInt((document.getElementById("state") as HTMLInputElement).value);   
          const nuevo = new Device(0, name, description, type, state);
          this.crearDispositivo(nuevo);
          this.renderizarDevices();

        }
     
    }
    private mostrarError(mensaje: string) {
       
        alert(`Error: ${mensaje}`);
    }

    private crearDispositivo(device: Device) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 201) {
                    alert("Dispositivo creado correctamente.");
                    this.renderizarDevices();
                } else {
                try {
                    //parsear el texto de error JSON
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.message || JSON.stringify(errorResponse);
                    this.mostrarError(errorMessage);
                } catch (e) {
                    //Si no texto tal cual
                    this.mostrarError(xhr.responseText);
                }
    
                
                
                }
            }
        };
        xhr.open("POST", "http://localhost:8000/devices", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(device));
    }

    private borrarDispositivo(id: number) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                this.renderizarDevices();
            }
        };
        xhr.open("DELETE", `http://localhost:8000/devices/${id}`, true);
        xhr.send();
    }

    private actualizarDispositivo(id: number, name: string, description: string, type: number, state: number) {
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', `http://localhost:8000/devices/${id}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({name, description, type, state }));
    }

    private actualizarState(id: number, state: number) {
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', `http://localhost:8000/devices/${id}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ state }));
    }

    public renderizarDevices() {
        const xmlReq = new XMLHttpRequest();
        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState === 4) {
                if (xmlReq.status === 200) {
                    const devices: Array<Device> = JSON.parse(xmlReq.responseText);
                    const div = document.getElementById("lista")!;
                    div.innerHTML = "";
                    let listado = "";

                    for (let o of devices) {
                        listado += `<li class='collection-item avatar'>`;
                        listado += `<img src="./static/images/${o.type === 0 ? "lightbulb.png" : "window.png"}" alt="" class="circle">`;
                        listado += `<span class="title">${o.name}</span>`;
                        listado += `<p>${o.description}</p>`;
                        listado += `
                            <div style="margin-top:10px;">
                                <label for="slider_${o.id}">Estado: <span id="valor_${o.id}">${o.state}</span>%</label>
                                <input type="range" id="slider_${o.id}" min="0" max="100" value="${o.state}" step="25">
                            </div>
                            <a class="secondary-content" style="margin-right: 20px;">
                                <button id="del_${o.id}" class="btn red btn-small">🗑</button>
                            </a>
                        `;
                        listado += `</li>`;
                    }

                    div.innerHTML = listado;

                    for (let o of devices) {
                        // Slider en tiempo real
                        const slider = document.getElementById("slider_" + o.id) as HTMLInputElement;
                        const spanValor = document.getElementById("valor_" + o.id);
                        slider?.addEventListener("input", () => {
                            if (spanValor) spanValor.textContent = slider.value;
                        });

                        // Guardar cambio
                        slider?.addEventListener("change", () => {
                            const nuevo = parseInt(slider.value);
                            this.actualizarState(o.id, nuevo);
                        });

                        // Botón borrar
                        const boton = document.getElementById("del_" + o.id);
                        boton?.addEventListener("click", () => {
                            if (confirm("¿Eliminar este dispositivo?")) {
                                this.borrarDispositivo(o.id);
                            }
                        });
                    }

                } else {
                    alert("falló la consulta");
                }
            }
        };

        xmlReq.open("GET", "http://localhost:8000/devices", true);
        xmlReq.send();
    }
}


window.addEventListener("load", () => {
    const main = new Main();

     const btnCrear = document.getElementById("btnCrear");
     btnCrear?.addEventListener("click", main); 
      console.log("btnCrear encontrado:", btnCrear);

     main.renderizarDevices();

    });
