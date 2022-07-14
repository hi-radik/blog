import {body} from 'express-validator'

export const postCreateValidator = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', "Введите текст статьи").isLength({min:10}).isString(),
    body('tags', 'Неверный формат тегов').optional().isArray(),
    body('imageUrl').optional().isURL()
]
