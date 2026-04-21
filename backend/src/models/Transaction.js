import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  
    },
    amount: {
        type: Number,
        required: true
    },
    billerName: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: ['TRANSFER', 'ADD_MONEY', 'BILL_PAYMENT', 'WITHDRAWAL'],
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);