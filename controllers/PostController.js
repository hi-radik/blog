import PostModel from '../models/Post.js'


//Создание поста
export const createPost = async (req,res) => {
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save()

        res.json(post)
    }
    catch (err) {
        console.log(err)
        res.status(404).json({message:'Ошибка создания статьи'})
    }
}


//Получить все статьи
export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)
    }

    catch (err) {
        console.log(err)
        res.status(404).json({message:'Не удалось получить статьи'})
    }
}

//Получить статью по id
export const getOnePost = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await PostModel.findOneAndUpdate({
            _id: postId
        },
        {$inc : {viewsCount: 1}},
        {returnDocument: 'after'})
        if (!post){
            console.log('Error')
            return res.status(404).json({message:'Статья не найдена'})
        }

        res.json(post)

        }
    

    catch (err) {
        console.log(err)
        res.status(404).json({message:'Не удалось получить статью'})
    }
}

//Удалить статью
export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.findOneAndDelete({
            _id: postId
        })

        console.log(`Статья с id ${postId} удалена!`)
        res.json({
            successs: true
        })

        }
    

    catch (err) {
        console.log(err)
        res.status(404).json({message:'Не удалось удалить статью'})
    }
}

//Удалить все статьи
export const removeAll = async (req, res) => {
    try {
        const posts = await PostModel.deleteMany()
        
        console.log(`Статьи успешно удалены!`)
        res.json({
            successs: true
        })

        }
    

    catch (err) {
        console.log(err)
        res.status(404).json({message:'Не удалось удалить статью'})
    }
}

//Обновить статью
export const update = async (req, res) => {
    try{
        const postId = req.params.id
        await PostModel.updateOne({
            _id: postId
        }, 
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })
        
        res.json({
            success: true
        })
        console.log(`Статья с id ${postId} успешно обновлена!`)
    }
    catch (err) {
        console.log(err)
        res.status(404).json({message:'Ошибка обновления статьи статьи'})
    }
}