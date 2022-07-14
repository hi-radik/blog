import express from 'express'
import mongoose from 'mongoose'
import {registerValidator} from './validations/auth.js'
import {loginValidator} from './validations/auth.js'
import {postCreateValidator} from './validations/post.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
const app = express()
app.use(express.json())
mongoose
    .connect('mongodb+srv://r:123@cluster0.ikrrf.mongodb.net/blog?retryWrites=true&w=majority')
    .then(()=>{console.log('DB ok')})
    .catch((err)=>{console.log('Db error', err)})


//Логин
app.post('/auth/login', loginValidator, UserController.login)
//Регистрация
app.post('/auth/register', registerValidator, UserController.register)
//Проверка
app.get('/auth/me', checkAuth, UserController.authMe)

//Посты
//Получить все статьи
app.get('/posts', PostController.getAllPosts)

app.get('/posts/:id', PostController.getOnePost)
app.post('/posts', checkAuth, postCreateValidator, PostController.createPost)
//app.delete('/posts',  PostController.remove)
//app.patch('/posts',  PostController.patch)

app.listen(4444, (err)=>{
    if(err){
        return console.log(err)
    }
    console.log('Ok')
})