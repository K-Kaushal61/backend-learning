import 'dotenv/config'
import connectDB from "./db/index.js";
import { app } from './app.js';


connectDB() // this is professional and good practice to connect database
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
         console.log(`Server is running at Port: ${process.env.PORT}`);
         
    });

})
.catch( (err) => {
    console.log("MongoDB connection failed !!!!", err); 
})

app.on("error", (err) => {
        console.log("ERROR:",err);
        throw err
});








// Below, Can be written but not good practice and should be ignored
/*
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) // DB is connected
    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})() 
*/