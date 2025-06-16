const Device = require('../models/Device');
//const { sanitize } = require('../utils/sanitize');

async function getAll(req, res) {
  try {
    console.log('Obtengo todos los dispositivos');
    const dv = await Device.findAll();
    if (dv) {
      res.status(200).json(dv);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getOne(req, res) {
  const { id } = req.params;
  console.log("Get device id: " + id);

  try {
    const DeviceFound = await Device.findOne({
      where: { id: id }
    });

    if (DeviceFound) {
      console.log("Se encontró");
      res.status(200).json(DeviceFound);
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
  const { id, n, d,s,t } = req.body;
  console.log("id:" + id + " name:" + n + " description:" + d + "state" + s + "type"+t);

 

  if (!(id && n && d && s && t)) {
    console.log('Id, name, description, state y type son obligatorios');
    return res.status(400).json({
      message: 'Id, name, description, state y type son obligatorios',
      status: 0,
    });
  }

  try {
    const existingDevice = await Device.findOne({
      where: { id: id }
    });

    if (existingDevice) {
      console.log('El Device ya existe.');
      return res.status(409).json({
        message: 'El Device ya existe. Elige un id distinto.',
        status: 0,
      });
    }

    const newDevice = await Device.create({
      id: id,
      name: n,
      description: d,
      state:s,
      type:t

    });

    console.log('Device creado con éxito.');
    return res.status(201).json({
      message: 'Device creado con éxito.',
      status: 1,
      data: newDevice
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
  const  {n, d,s,t } = req.body;

  console.log("id:" + id + " name:" + n + " description:" + d + "state" + s + "type"+t);


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
      name: n || dv.name || null,
      description: d || dv.description || null,
      state: s   || dv.state || null,    
      type: t   || dv.type|| null    
    
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