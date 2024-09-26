
import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
        userName: String,
        nameBlock: String,
        numberQuests: {
                quests:[
                { idQuest: {type: String , default: ''},
                numberQuest :{type: Number, default: 0}}
                ]
        }
})

const UserProgress = mongoose.model('UserProgress',userProgressSchema,'UserProgress');
export default UserProgress;

