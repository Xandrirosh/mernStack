const express =require('express');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controller/goalController');
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()


router.get('/', protect, getGoals)

router.post('/', protect, createGoal)

router.put('/:id',protect, updateGoal)

router.delete('/:id',protect, deleteGoal)

module.exports = router