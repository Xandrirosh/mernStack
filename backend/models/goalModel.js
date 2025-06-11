const mongoose = require('mongoose')

const goalSchema = mongoose.Schema({
    users: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User',

    },
    text:{
        type:String,
        required:[true, 'please add a text value']
    }
},
{
    timestamps: true
}
)

module.exports =mongoose.model('Goal', goalSchema)