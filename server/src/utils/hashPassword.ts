import bcrypt from 'bcrypt'

const  hashPassword = async (password:string)=>{
 const hashed = await bcrypt.hash(password,12);
 
  return hashed


}  

const compareHash = async (password:string,hash:string)=>{

       return await  bcrypt.compare(password,hash)
}
export {hashPassword,compareHash}
