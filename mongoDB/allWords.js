import mongoose from "mongoose";

const verbSchema = new mongoose.Schema({
    title: String,
    eng: String ,
    rus: String ,
    explanation_eng: String ,
    explanation_rus: String ,
})

const verbModel = mongoose.model('verbModel',verbSchema,'Words');


export default verbModel;