
declare const M: any;

class Main implements EventListenerObject {
    
    handleEvent(event: Event): void {
        const elemento = <HTMLElement>event.target;
        //manejo del boton crear-click
        if (elemento.id === "btnCrear" && event.type === "click") {
         
          const name = (document.getElementById("name") as HTMLInputElement).value;
          const description = (document.getElementById("description") as HTMLInputElement).value;
          const type = parseInt((document.getElementById("type") as HTMLSelectElement).value);
          const state = parseInt((document.getElementById("state") as HTMLInputElement).value);   
          const nuevo = new Device(0, name, description, type, state);
          //lo creo
          this.crearDispositivo(nuevo);
         
        }
       //manejo el boton guarda cambios del modal 
        if (elemento.id === "btnGuardarCambios" && event.type === "click") {
         
            const id = parseInt((document.getElementById("btnGuardarCambios") as HTMLButtonElement).dataset.id!);
            const name = (document.getElementById("editName") as HTMLInputElement).value;
            const description = (document.getElementById("editDescription") as HTMLInputElement).value;
            const type = parseInt((document.getElementById("editType") as HTMLSelectElement).value);
            const state = parseInt((document.getElementById("editState") as HTMLInputElement).value);
            this.actualizarDispositivo(id, name, description, type, state);
            }
         
          
  

    }
    //mostrar error
    private mostrarError(mensaje: string) {
       
        alert(`Error: ${mensaje}`);
    }
    //crea dispositivo
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
    //borrar disposito
    private borrarDispositivo(id: number) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 )
            { 
                  if( xhr.status === 200) {
                      this.renderizarDevices();
                     } 
                  else 
                  {
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
        xhr.open("DELETE", `http://localhost:8000/devices/${id}`, true);
        xhr.send();
    }

    private actualizarDispositivo(id: number, name: string, description: string, type: number, state: number) 
        {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
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
        xhr.open('PATCH', `http://localhost:8000/devices/${id}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({name, description, type, state }));
    
    }

    private actualizarState(id: number, state: number)
        
        {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
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
                            <button class="btn-small blue" id="edit_${o.id}">✏️ Editar</button>
                                                 
                            `;
                        listado += `</li>`;
                    }

                    div.innerHTML = listado;

                    for (let o of devices) {
                        //Slider en tiempo real
                        const slider = document.getElementById("slider_" + o.id) as HTMLInputElement;
                        const spanValor = document.getElementById("valor_" + o.id);
                        slider?.addEventListener("input", () => {
                            if (spanValor) spanValor.textContent = slider.value;
                        });

                        //Guardar cambio
                        slider?.addEventListener("change", () => {
                            const nuevo = parseInt(slider.value);
                            this.actualizarState(o.id, nuevo);
                        });

                        //Botón borrar
                        const boton = document.getElementById("del_" + o.id);
                        boton?.addEventListener("click", () => {
                            if (confirm("¿Eliminar este dispositivo?")) {
                                this.borrarDispositivo(o.id);
                            }
                        });
                    }

                    const modalInstance = M.Modal.getInstance(document.getElementById('modalEditar'));

                    for (let o of devices) {
                     document.getElementById(`edit_${o.id}`)?.addEventListener("click", () => {
                     (document.getElementById("editName") as HTMLInputElement).value = o.name;
                     (document.getElementById("editDescription") as HTMLInputElement).value = o.description;
                     (document.getElementById("editType") as HTMLSelectElement).value = o.type.toString();
                     (document.getElementById("editState") as HTMLInputElement).value = o.state.toString();

                    //Refrescar los labels y selects
                    M.updateTextFields();
                    M.FormSelect.init(document.querySelectorAll('select'));

                   //Guardar el ID para actualizar
                    (document.getElementById("btnGuardarCambios") as HTMLButtonElement).dataset.id = o.id.toString();

                    modalInstance.open();
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
     //boton de creacion
     const btnCrear = document.getElementById("btnCrear");
     btnCrear?.addEventListener("click", main); 
     console.log("btnCrear encontrado:", btnCrear);
    //boton de actualizacion con el modal
     const btnGuardarCambios= document.getElementById("btnGuardarCambios");
     btnGuardarCambios?.addEventListener("click",main);
     main.renderizarDevices();

    });
