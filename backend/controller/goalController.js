const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

//@desc Get goals
//@route GET /api/goals
//@access private
const getGoals = asyncHandler(async (req, res, next) => {
    const goals = await Goal.find({ users: req.user.id });
    res.status(200).json(goals)
})

//@desc create goal
//@route POST /api/goal
//@access private
const createGoal = asyncHandler(async (req, res, next) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('please add a text field')
    }
    const goal = await Goal.create({
        text: req.body.text,
        users: req.user.id,
    })
    res.status(201).json(goal);
})

//@desc Update goal
//@route PUT /api/goal/:id
//@access private
const updateGoal = asyncHandler(async (req, res, next) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }
    const user = await User.findById(req.user.id)
    //check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //make sure the logged in user matches the goal user
    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('user not authorized')
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
        }
    )
    res.status(200).json(updatedGoal);
})

//@desc Delete goal
//@route DELETE /api/goal/:id
//@access private
const deleteGoal = asyncHandler(async (req, res, next) => {
    const goal = await Goal.findById(req.params.id)
    //check for goal
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }
    if (!goal.user) {
        res.status(400)
        throw new Error('Goal not found')
    }
    const user = await User.findById(req.user.id)
    //check for user
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //make sure the logged in user matches the goal user
    if (goal.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }


    await goal.deleteOne();

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
}