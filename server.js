import express from 'express';
import expressHandlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import UserForm from './mongoDB/users.js';
import bcrypt from 'bcrypt'
import verbModel from './mongoDB/allWords.js';
import jwt from 'jsonwebtoken';
import UserProgress from './mongoDB/userProgress.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotevn from 'dotenv'
dotevn.config()

const app = express();
const port = 3001;

const handlebars = expressHandlebars.create({
	defaultLayout: 'main', 
	extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }, 
});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1:27017/Cards_Game', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB: '));
db.once('open', () => {
  console.log('Подключено к MongoDB');
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const saltRound = 10;

app.get('/api/date', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }
  try{
    const decoded = jwt.verify(token, '12345');
    if (decoded) {   
      const catAbout = (await verbModel.find({ title:'About' })).length;
      const catAt = (await verbModel.find({ title:'At' })).length;
      const catAway = (await verbModel.find({ title:'Away' })).length;
      const catBy = (await verbModel.find({ title:'By' })).length;
      const catDown = (await verbModel.find({ title:'Down' })).length;
      const catOff = (await verbModel.find({ title:'Off' })).length;
      const catOut = (await verbModel.find({ title:'Out' })).length;
      const catUp = (await verbModel.find({ title:'Up' })).length;
      const catAll = (await verbModel.find({})).length;
      const userProgQuest = await UserProgress.find({name: decoded.userName});
      const getIdQuests = userProgQuest.map((itemId) => itemId.numberQuests.quests.map(item => item.idQuest));
      const flatArray = getIdQuests.flat();
      const getAllQuestArray = [];

      for (const item of flatArray) {
        const getAllQuest = await verbModel.find({_id: item});
        getAllQuestArray.push(getAllQuest);
      }

      const flatAllArr = getAllQuestArray.flat();
      const allIdAnsweredQuests = flatAllArr.map(item => item._id.toString());
      const needToLearn = await verbModel.find({_id : {$nin : allIdAnsweredQuests}});
      const arrTitlles = [
        {'About': catAbout},
        {'At': catAt},
        {'Away': catAway},
        {'By': catBy},
        {'Down': catDown},
        {'Off': catOff},
        {'Out': catOut},
        {'Up': catUp},
        {'AllQuestions': catAll},
      ];
      const userTitle = userProgQuest.map(item => item.nameBlock);
      const userQuests = userProgQuest.map(item => item.numberQuests.quests.length);
      const obj = userTitle.reduce((acc, cur, index) => {
        acc[cur] = userQuests[index];
        return acc;
      },{})
      const titlesArr = [];

      arrTitlles.forEach(item => {
        const [key, value] = Object.entries(item)[0];
        if (obj.hasOwnProperty(key) && obj[key] === value) {
          titlesArr.push(key);
        }
      })

      const filterTitles = arrTitlles.filter((item) => (Object.keys(item)[0] !== titlesArr.find(title => title === Object.keys(item)[0])));
      const newTitles = filterTitles.filter((item) => !titlesArr.includes(Object.keys(item)[0]));
      const allUserQuestions = await UserProgress.find({})
      return res.json({"success": true, "arrTitles": newTitles, "words": flatAllArr, "allWords": needToLearn, "totalWords": arrTitlles, 'allUserQuestions': allUserQuestions })
    }
  } catch (err) {
    console.log(err);
  }
})

app.get('/api/date/:blockName', async (req,res) => {
  const blockName = req.params.blockName;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }
  try {
    let data;
    const decoded = jwt.verify( token, '12345' );
    if ( decoded ) {
      const dataInfo = await verbModel.find({ title: blockName });

      if (dataInfo.length !== 0) {
        data = dataInfo;
      } else {
        data = await verbModel.find({});
      }

      const knowQuestionsUser = await UserProgress.findOne({ userName: decoded.username, nameBlock: blockName });

        if ( knowQuestionsUser ) {
          const answeredQuestionsId = knowQuestionsUser.numberQuests.quests.map((item) => item.idQuest);
          const allQuestions = data.filter((item) => !answeredQuestionsId.includes(item._id.toString()));
          return res.json({ 'success': true, 'data': allQuestions });
        } else {
          return res.json({ 'success': true, 'data': data });
        } 

      } 
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Недействительный токен' });
    }
    return res.status(500).json({ message: 'Произошла ошибка при проверке токена' });
  }
})

app.post('/register-user', async (req,res) => {
  const {name,password,email} = req.body;
  if (!name || !password || !email) {
    return res.status(400).json({error: 'Заполните все обязательные поля'});
  }
  try {
    const isCheckUserName = await UserForm.findOne({name: name});
    const isCheckUserEmail = await UserForm.findOne({email: email});

    if(isCheckUserName || isCheckUserEmail) {
      res.json({'success': false, 'message': 'Такой пользователь уже есть'});
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRound);
      const newUser = {
        name: name,
        password: hashedPassword,
        email: email,
        resetToken: ''
      };
    const userNew = await UserForm.collection.insertOne(newUser);
    const payload = {
      user_id: userNew._id,
      username: userNew.name
      }
    const token = jwt.sign(payload, '123', {expiresIn: '1h'});
    res.json({ success: true, message: 'Пользователь успешно зарегистрирован', authorization: token });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Произошла ошибка при регистрации пользователя' });
  }
})

app.post('/check-user', async (req, res) => {
  const {email, password} = req.body;
  try{
    const checkUser = await UserForm.findOne({email:email});
    const payload = {
      user_id : checkUser._id,
      username: checkUser.name
    }
    const token = jwt.sign(payload, '12345');
    if (!checkUser) {
       return res.json({success: false, message: 'Пользователь не найден'});
    }
    const passwordMatch = bcrypt.compare(password, checkUser.password);
    if (passwordMatch) {
      return res.json({ success: true, message: 'Вход выполнен успешно', name: checkUser.name, authorization: token});
    } else {
      return res.json({ success: false, message: 'Неверный пароль' });
    }
  }catch (err) {
    return res.status(500).json({ success: false, message: 'Произошла ошибка при входе'});
}
})

app.post('/progress-user/', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const idQuest = req.body.quest._id;
  const number = +req.body.numberQuest;
  const decode = jwt.verify(token,'12345');
  const category = req.body.title;
  try {
    if (decode) {
      const userName = decode.username;
      const exitingUserProgress = await UserProgress.findOne({userName: userName, nameBlock: category,});

      if (!exitingUserProgress) {
        const userProgress = new UserProgress({
        userName: userName,
        nameBlock: category,
        numberQuests:{
          quests:
            [
              {
              idQuest: idQuest,
              numberQuest: number
              }
            ]
          } 
        })
        await userProgress.save();
        return res.json({"success": true});
      } else {
        const arrIdQuests = exitingUserProgress.numberQuests.quests.map((item) => item.idQuest);

        if (!arrIdQuests.includes(idQuest)) {
          const newQuest = {
              idQuest: idQuest,
              numberQuest: number
            };
            exitingUserProgress.numberQuests.quests.push(newQuest);
            await exitingUserProgress.save();
        } 
          return res.json({"success": true});  
        } 
      } 
    } catch(err) {
      return res.status(500).json({ "success": false, "error": err.message });
  }
})

app.get('/delete-progress', async(req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }
  const decoded = jwt.verify(token,'12345');
  try{
      if (decoded) {
        const userName = decoded.username;
        const isUser = await UserProgress.findOne({userName: userName});

        if (isUser !== null) {
          await UserProgress.deleteMany({userName: userName});
          res.json({'success': true});
        } else {
          res.json({'success': false});
        }
      }
  }catch (err) {
    return res.status(500).json({ "success": false, "error": err.message });
  }
})

app.post('/check-email', async (req, res) => {
  const {USER_EMAIL, USER_PASSWORD} = process.env
  const {email} = req.body;
  try{
    const isEmailUserFromDataBase = await UserForm.findOne({email: email})
    if (!isEmailUserFromDataBase) {
      return res.json({"success": false, "message": 'Такой пользователь не зарегистрирован'})
    } else {
      const verifycationCode = Math.floor(1000 + Math.random() * 9000);
      const user = await UserForm.findOne({email})
      user.resetToken = verifycationCode;
      await user.save();

      const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
          user: USER_EMAIL, 
          pass: USER_PASSWORD, 
        }
      })

      const mailOptions = {
        from: `engRus ${USER_EMAIL}`,
        to: email,
        subject: 'Код верификации',
        html: `Ваш уникальный код <strong>${verifycationCode}</strong> `
      }

      await transporter.sendMail(mailOptions)

      return res.json({"success": true, "message": 'Письмо с 4-х значным кодом отправлено на Ваш email.' })
    }
  } catch(error) {
    console.error('Ошибка при проверке электронной почты:', error);
    return res.status(500).json({ "success": false, "message": 'Произошла ошибка на сервере' });
  }
  

})

app.post('/check-validationCode', async(req, res) => {
  const {passCode} = req.body;
  const isOnlyDigits  = /^\d{4}$/.test(passCode);

  
  try{
    const user = await UserForm.findOne({resetToken: passCode})

    if(!passCode || !isOnlyDigits || !user) {
      return res.json({"succes": false, "message": 'Данные не соответствуют'})
    } 
    
    if (user) {
     return res.json({"success": true, "messsage": 'Успешно'}) 
    }
    
  }catch(error) {
    
  }
})

app.post('/reset-password', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const {newPassword} = req.body;
  console.log(newPassword)

  if (!token) {
    return res.status(401).json({ "success": false, "message": 'Отсутствует токен авторизации' });
  }

  const hasLetter = /[a-zA-Z]{1,20}/.test(newPassword);
  const hasNumber = /\d{1,20}/.test(newPassword);
  const hasSymbol = /[!@#$%^&*]{1,20}/.test(newPassword);

  if (!newPassword || !hasLetter || !hasNumber || !hasSymbol || newPassword.length < 8 || newPassword.length > 20 ) {
    return res.json({"succes": false, "message": 'Пароль должен содержать хотя бы 1 букву, 1 цифру, 1 символ и должен состоять минимум из 8 символов '})
  }

  try{
    const user = await UserForm.findOne({resetToken: token})
    if (user) {
      user.resetToken = null;
      const hashedPassword = await bcrypt.hash(newPassword, saltRound);
      user.password = hashedPassword;
      user.save()
      res.json({"success": true, 'message': "Пароль успешно изменен"})
    }

  }catch(error){
    console.error('Ошибка при сбросе пароля:', error);
    return res.status(500).json({ "success": false, "message": 'Произошла ошибка на сервере' });
  }



})

app.listen(port, () => {
    console.log(`server run ${port}`)
})


