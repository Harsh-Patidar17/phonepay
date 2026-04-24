import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if(!name || !email || !phone || !password) {
            return res.status(400).json({message: 'Please provide all required fields'}); 
        }

        let userExists = await User.findOne({$or : [{email}, {phone}]});
        if(userExists) {
            return res.status(400).json({message: 'User already exists'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        // upiId
        const sanitized = email.toLowerCase();
        const upiId = `${sanitized.split('@')[0]}@phonepay`;

        // create new User

        const user = await User.create({
            name, 
            email,
            password: hashed,
            phone,
            upiId,
        })
        if(user) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                upiId: user.upiId,
                balance: user.balance,
                hasMpinSet: false,
                token: generateToken(user._id)
            })
        } 
        else {
            return res.status(400).json({message: 'Invalid user data'}); 
        }

        
    } catch (err) {
        res.status(500).json({message: 'Server error', error:err.message});
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(401).json({message: 'Incomplete details'});
        }
        const userExist = await User.findOne({email});

        if(!userExist) {
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const hashedPassword = userExist.password;
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if(!isMatch) {
            return res.status(401).json({message: 'Invalid credentials'});
        }
        return res.status(200).json({
            _id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            phone: userExist.phone,
            upiId: userExist.upiId,
            balance: userExist.balance,
            hasMpinSet: !!userExist.mpin,
            token: generateToken(userExist._id)
        })

    } catch (error) {
        console.log('Credentials are wrong.');
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

export const setUpMpin = async (req, res) => {
        const { mpin } = req.body;
        if(!mpin || mpin.length != 4) {
            return res.status(400).json({message: 'Mpin must be 4 digits'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(mpin, salt);
        
            const updatedUser = await User.findByIdAndUpdate(req.user._id, {mpin: hashed}, {returnDocument: 'after'});
            if(updatedUser) {
                return res.status(200).json({message: 'Mpin set successfully'});
            } else {
                return res.status(400).json({message: 'Error setting mpin'});
            }
        }

export const getUserProfile = async (req, res) => {
            try {
                const user = await User.findById(req.user._id).select('-password -mpin');
                if(user) {
                    return res.status(200).json(user);
                } else {
                    return res.status(404).json({message: 'User not found'});
                }
            } catch (error) {
                return res.status(500).json({message: 'Server error', error: error.message});
            }
        }   
