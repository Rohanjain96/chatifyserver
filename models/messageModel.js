const mongoose = require("mongoose")
const messageSchema = mongoose.Schema({
    content:
    {
        type: String,
        trim: true,
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chat: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Chat"
    },
    readBy: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User"
        }],
    type: {
        type: String,
    },
    file_path: {
        type: Buffer,
    },
    file_data: {
        type: Buffer,
    },
    file_mimetype: {
        type: String,
    }

}, { timestamps: true });


const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
