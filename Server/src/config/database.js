// Connecting to Database 
import mongoose from "mongoose";

const DBConnection = async ()=>{
   await mongoose.connect("mongodb+srv://kunalrkathiriya123_db_user:enIBNtqMBEwr08KP@devtinder-clustor.uruhctq.mongodb.net/DevTinder")
}

export default DBConnection;

