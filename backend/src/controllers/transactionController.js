import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';

export const sendMoney = async (req, res) => {
    try {
        const { phone, mpin, amount } = req.body;
        const senderId = req.user._id;

        if(!mpin) {
            return res.status(401).json({message: 'Mpin is required'});
        }
        if(amount <= 0) {
            return res.status(401).json({message: 'Amount must be greater than zero.'})
        }
        const senderDetails = await User.findById(senderId);

        const isMpinMatch = await bcrypt.compare(mpin, senderDetails.mpin);

        if(!isMpinMatch) {
            return res.status(401).json({message: 'Invalid Mpin'});
        }


        if(amount > senderDetails.balance) {
            return res.status(401).json({message: 'Insufficient balance'});
        }
        const receiverDetails = await User.findOne({phone});

        senderDetails.balance -= amount;
        receiverDetails.balance += amount;

        await senderDetails.save();
        await receiverDetails.save();

        const transaction = await Transaction.create({
            sender: senderDetails._id,
            receiver: receiverDetails._id,
            amount,
            type: 'TRANSFER',
            status: 'COMPLETED'
        })

        return res.json({message: 'Money sent successfully', transaction});
    }   
    catch (error) {
        return res.status(500).json({message: 'Server error', error: error.message});
    }
}

export const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const transactions = await Transaction.find({
            $or: [{sender: userId}, {receiver: userId}]
        }).populate('sender', 'name email phone').populate('receiver', 'name email phone');
    
        return res.json(transactions);
    }
    catch(error) {
        return res.status(500).json({message: 'Server error', error: error.message});
    }

}