const Device = require('../models/Device');
const {sanitize}  = require('../utils/sanitize.js');

async function getAll(req, res) {
  try {
    console.log('Obtengo todos los dispositivos');
    const dv = await Device.findAll();
    if (dv) {
      res.status(200).json(sanitize(dv));
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getOne(req, res) {
  const { id } = req.params;
  console.log("Get device id: " + id);

if (!(id)) {
    console.log('id es obligatorios');
    return res.status(400).json({
      message: 'id es obligatorio',
      status: 0,
    });
  }


  try {
    const DeviceFound = await Device.findOne({
      where: { id: id }
    });

    if (DeviceFound) {
      console.log("Se encontró");
      res.status(200).json(sanitize(DeviceFound));
    } else {
      console.log("No se encontró");
      res.status(404).json({ message: 'No se encuentra el Device.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Algo salió mal',
      data: { error }
    });
  }
}

async function crearDevice(req, res) {
  const {  name, description ,state,type } = req.body;
  console.log("name: " + name + " description: " + description + " state: " + state + " type:"+type);

   const numeroType = parseInt(type);
   const numeroState = parseInt(state);

  if(isNaN(numeroState) && !(0<=state && state<=100))
  {
    console.log('el valor de state tiene que ser un porcentaje entre 0 y 100');
    return res.status(400).json({
      message: 'el valor de state tiene que ser un porcentaje entre 0 y 100',
      status: 0,
    });
  }
  

  if(isNaN(numeroType) &&  !(0==numeroType || numeroType==1))
  {
    console.log('el valor de type esta mal definido');
    return res.status(400).json({
    message: 'el valor de type esta mal definido',
    status: 0,
    });
  }


  if (!name || !description  ) {
    console.log('name y description deben estar definidos');
    return res.status(400).json({
      message: 'name y description deben estar definidos',
      status: 0,
    });
  }

  try {
    const existingDevice = await Device.findOne({
      where: { name: name }
    });

    if (existingDevice) {
      console.log('El Device ya existe.');
      return res.status(409).json({
        message: 'El Device ya existe. Elige un name distinto.',
        status: 0,
      });
    }

    const newDevice = await Device.create({
      name: name,
      description: description,
      state:numeroState,
      type:numeroType

    });

    console.log('Device creado con éxito.');
    return res.status(201).json({
      message: 'Device creado con éxito.',
      status: 1,
      data: sanitize(newDevice)
    });

  } catch (error) {
    console.error('Error al crear el device:', error);
    return res.status(500).json({
      message: 'Ocurrió un error inesperado.',
      status: 0,
      error: error.message,
    });
  }
}

async function deleteDevice(req, res) {
  const { id } = req.params;
  console.log("id: " + id + " para borrar");


  if (!(id)) {
    console.log('id es obligatorios');
    return res.status(400).json({
      message: 'id es obligatorios',
      status: 0,
    });
  }

  try {
    const deletedRecord = await Device.destroy({
      where: { id: id }
    });

    if (deletedRecord > 0) {
      console.log("id: " + id + " se borró correctamente");
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log("id: " + id + " no existe registro");
      res.status(404).json({ message: "No existe registro" });
    }

  } catch (error) {
    console.error('Error al borrar: ', error);
    res.status(500).json({
      message: 'Hubo un error',
      data: { error }
    });
  }
}

async function updateDevice(req, res) {
  const { id } = req.params;
  const  {name, description,state,type } = req.body;

  console.log("id: " + id + " name: " + name + " description: " + description + " state: " + state + " type:"+type);

if (!id) {
    console.log('id es obligatorios');
    return res.status(400).json({
      message: 'id es obligatorios',
      status: 0,
    });
  }

if(state!== undefined)
{
  const numeroState = parseInt(state);
  if(isNaN(numeroState) && !(0<=state && state<=100))
  {
     console.log('el valor de state tiene que ser un porcentaje entre 0 y 100');
     return res.status(400).json({
      message: 'el valor de state tiene que ser un porcentaje entre 0 y 100',
      status: 0,
    });
  }
}

if(type!== undefined)
{
const numeroType = parseInt(type);
   
if(isNaN(numeroType) &&  !(0==numeroType || numeroType==1))
  {
    console.log('el valor de type esta mal definido');
    return res.status(400).json({
    message: 'el valor de type esta mal definido',
    status: 0,
    });
  }
}

  try {
    const dv = await Device.findOne({
      where: { id: id },
      attributes: ['id', 'name', 'description','state','type']
    });

    if (!dv) {
      console.log("id: " + id + " no encontrado");
      return res.status(404).json({ message: 'Device no encontrado.' });
    }
    



    await dv.update({
      id: id,
      name: name !== undefined ? name : dv.name,
      description: description !== undefined ? description : dv.description,
      state: state !== undefined ? state : dv.state,
      type: type !== undefined ? type : dv.type

    });

  
    console.log("id: " + id + " se actualizó correctamente");
    res.status(200).json({ message: 'Device se actualizó correctamente.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Algo no funcionó',
      data: { error }
    });
  }
}

module.exports = {
  getAll,
  getOne,
  crearDevice,
  deleteDevice,
  updateDevice
};