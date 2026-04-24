import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';

export const sendMoney = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { phone, mpin, amount } = req.body;
        const senderId = req.user._id;

        if(!mpin) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({message: 'Mpin is required'});
        }
        if(amount <= 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({message: 'Amount must be greater than zero.'})
        }
        const senderDetails = await User.findById(senderId).session(session);

        const isMpinMatch = await bcrypt.compare(mpin, senderDetails.mpin);

        if(!isMpinMatch) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({message: 'Invalid Mpin'});
        }

        if(amount > senderDetails.balance) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({message: 'Insufficient balance'});
        }
        const receiverDetails = await User.findOne({phone}).session(session);
        
        if(!receiverDetails) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({message: 'Receiver not found'});
        }

        senderDetails.balance -= amount;
        receiverDetails.balance += amount;

        await senderDetails.save({ session });
        await receiverDetails.save({ session });

        const transaction = await Transaction.create([{
            sender: senderDetails._id,
            receiver: receiverDetails._id,
            amount,
            type: 'TRANSFER',
            status: 'COMPLETED'
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return res.json({message: 'Money sent successfully', transaction: transaction[0]});
    }   
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message: 'Server error', error: error.message});
    }
}

export const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const transactions = await Transaction.find({
            $or: [{sender: userId}, {receiver: userId}]
        }).sort({ createdAt: -1 }).populate('sender', 'name email phone').populate('receiver', 'name email phone');
    
        return res.json(transactions);
    }
    catch(error) {
        return res.status(500).json({message: 'Server error', error: error.message});
    }

}