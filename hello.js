import bcrypt from "bcrypt";

const hash = await bcrypt.hash("Password@123", 10);
console.log(hash);