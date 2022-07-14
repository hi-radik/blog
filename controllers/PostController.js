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
        const postId = req.params.id;

        //Получаем статью и обновляем ее
        await PostModel.findOneAndUpdate({
            _id: postId,
        }, {
            $inc: {viewsCount: 1}
        }, 
        {returnDocument: 'after'}),
        (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({message:'Не удалось получить статью'})
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                })
            }
            res.json(doc)

        }
    }

    catch (err) {
        console.log(err)
        res.status(404).json({message:'Не удалось получить статьи'})
    }
}