import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    }, 
    phone: {
        type: String,
        required: true,
        unique: true
    }, 
    upiId: {
        type: String, 
        unique: true
    }, 
    balance: {
        type: Number,
        default: 0
    },
    mpin: {
        type: String
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);