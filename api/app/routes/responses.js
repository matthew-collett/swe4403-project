const express = require('express')
const router = express.Router()
const {
  getResponses,
  getResponseById,
  createResponse,
  updateResponse,
  deleteResponse,
} = require('../controllers/responsesController')

router.get('/', getResponses)
router.get('/:id', getResponseById)
router.post('/', createResponse)
router.put('/:id', updateResponse)
router.delete('/:id', deleteResponse)

module.exports = router
