import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import {registerValidator} from './validations/auth.js'
import {loginValidator} from './validations/auth.js'
import {postCreateValidator} from './validations/post.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import handleValidationError from './utils/handleValidationError.js'

const app = express()
app.use(express.json())

//Для статики
app.use('/uploads', express.static('uploads'))

mongoose
    .connect('mongodb+srv://r:123@cluster0.ikrrf.mongodb.net/blog?retryWrites=true&w=majority')
    .then(()=>{console.log('DB ok')})
    .catch((err)=>{console.log('Db error', err)})


//Создадим хранилище
const storage = multer.diskStorage({
    //Когда файл будет загружаться - вернется путь файла
    destination: (_,__,cb) => {
        cb(null, 'uploads')
    },
    //Как называется файл
    filename: (_,file,cb)=> {
        cb(null, file.originalname)
    }
})

//Создадим функцию хранилище
const upload = multer ({storage});

//Логин
app.post('/auth/login', loginValidator, handleValidationError, UserController.login)
//Регистрация
app.post('/auth/register', registerValidator, handleValidationError, UserController.register)
//Проверка
app.get('/auth/me', checkAuth, UserController.authMe)

//Посты
//Получить все статьи
app.get('/posts', PostController.getAllPosts)
//Получить статью по id
app.get('/posts/:id', PostController.getOnePost)
//Создать статью
app.post('/posts', checkAuth, postCreateValidator, handleValidationError, PostController.createPost)
//Удалить статью
app.delete('/posts/:id',  checkAuth, PostController.remove)
//Удалить все статьи
app.delete('/posts',  checkAuth, PostController.removeAll)
//Обновить статью
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationError, PostController.update)

//Файлы
//Загрузить картинку - если придет пост на upload, то мы перед тем, как выполнить что-то, выполнить multer функцию upload.single()
app.post('/uploads', checkAuth, upload.single('image'), (req,res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.listen(4444, (err)=>{
    if(err){
        return console.log(err)
    }
    console.log('Ok')
})
