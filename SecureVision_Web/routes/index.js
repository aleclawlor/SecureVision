let express = require('express')
let router = express.Router()

const authRoutes = require('./authRoutes')
const registerRoutes = require('./registerRoutes')
const cameraRoutes = require('./cameraRoutes')
const getPlateRoutes = require('./accessPlates')
const editRoutes = require('./editRoutes')
const unrecognizedPlatesRoutes = require('./unregisteredPlates')
const contactsRoutes = require('./contactsRoutes')
const phoneCalls = require('./phoneCalls')
const lprRoutes = require('./lprRoutes')

router.use('/auth', authRoutes)
router.use('/registration', registerRoutes)
router.use('/cameras', cameraRoutes)
router.use('/get', getPlateRoutes)
router.use('/edit', editRoutes)
router.use('/unrecognized', unrecognizedPlatesRoutes)
router.use('/contacts', contactsRoutes)
router.use('/phone', phoneCalls)
router.use('/lpr', lprRoutes)

module.exports = router 