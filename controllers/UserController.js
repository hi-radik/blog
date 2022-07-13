//Регистрация
export const register = async (req,res)=>{
    try {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json(errors.array())
     }
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