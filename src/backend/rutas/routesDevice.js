//console.log('[routesDevice] cargando rutasDevice.js');

const express = require('express');
const {sanitizeMiddlewareInput}  = require('../utils/sanitize.js');

const {
    // ensureToken,
    // chequeoToken,
    // chequeoGrupoUsuario,
    getAll,
    getOne,
    crearDevice,
    deleteDevice,
    updateDevice,
} = require('../controllers/DeviceController.js');

const router = express.Router();

// APIs
router.get('/devices',/* ensureToken, chequeoToken, chequeoGrupoUsuario('admin'),*/ getAll);
router.get('/devices/:id', sanitizeMiddlewareInput, /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'),*/ getOne);
router.post('/devices', sanitizeMiddlewareInput,crearDevice);
router.delete('/devices/:id', sanitizeMiddlewareInput, deleteDevice);
router.patch('/devices/:id', sanitizeMiddlewareInput, updateDevice);


module.exports = router;