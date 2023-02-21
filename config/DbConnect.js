import {mongoose} from 'mongoose'

 export const DBConnect = async ()=>{
    return await mongoose.connect(process.env.MongoDb_Url)
    .then(() => {
        console.log(`DataBase Work `);
    }).catch((err) => {
        console.log(`bad Connection with DB `,err);
    });
}
