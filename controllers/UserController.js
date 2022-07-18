import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import UserModel from '../models/User.js'
import checkAuth from '../utils/checkAuth.js'
import {validationResult} from 'express-validator'

//Регистрация
export const register = async (req,res)=>{
    try {
     
     const password = req.body.password
     const salt = await bcrypt.genSalt(3)
     const hash = await bcrypt.hash(password, salt)
 
     const doc = new UserModel({
         email: req.body.email,
         passwordHash: hash,
         name: req.body.name,
         avatarUrl: req.body.avatarUrl,
     })
 
     const user = await doc.save()
 
     const token = jwt.sign({
         _id: user._id,
     }, 'secret123',{
         expiresIn: '30d'
     })
 
     const {passwordHash, ...userData} = user._doc
     res.json({...userData, token})
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
     } }

//Логин
export const login = async (req,res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        
        const user = await UserModel.findOne({email: req.body.email})

        if (!user) {
            return res.status(400).json({
                message:'Пользователь не найден'
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPassword) {
            return res.status(400).json({
                message:'Ошибка авторизации'
            })
        }
        const token = jwt.sign({
            _id: user._id,
        }, 'secret123',{
            expiresIn: '30d'
        })
        const {passwordHash, ...userData} = user._doc
        res.json({...userData, token})

        
    
    }
    catch (err){
        console.log(err)
       res.status(500).json({
           message: 'Не удалось авторизоваться'
       })
    }
}

//Проверка аутентификации
export const authMe = async (req, res) => {
    try{

        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message:'Пользователь не найден'
            })
        }
        const {passwordHash, ...userData} = user._doc
        res.json({...userData})
    }

    catch (err) {

    }
}