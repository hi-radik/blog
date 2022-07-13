import {body} from 'express-validator'

export const registerValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', "Минимальная длина пароля 5 символов").isLength({min:5}),
    body('name').isLength({min:3}),
    body('avatarUrl').optional().isURL()
]

export const loginValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password').isLength({min:5}),
]