const { getUserByEmail, getUserById, updateEmail,updateUserProfileImage, updateUser }  = require("../database/postgres/userDatabase");
const { getUuidv4 } = require("../utils/random");
const { uploadImageToStorage } = require("../utils/storage");
const { isInputInvalid }  = require("../utils/validation");

async function getUserProfile(request,h){
    try{
        const user = request.user;
    
        const getUser = await getUserById(user.id);
    
        return h.response({
            message:`success get user profile`,
            data: {
                id:                 getUser.id,
                googleId:           getUser.googleId,
                name:               getUser.name,
                email:              getUser.email,
                profileImageUrl:    getUser.profileImageUrl,
                authMethod:         getUser.authMethod
            }
        }).code(200);
    } catch(err){
      console.error(err);
      return h
        .response({
          error: "something went wrong, please contact pocketwise support",
        })
        .code(500);
  }
}

async function updateUserProfile(request,h){
    try{
        const user = request.user;
    
        const { name } = request.payload;
    
        if(isInputInvalid(name))
            return h.response({
                error:"input is invalid"
            }).code(400);
    
        const userFromId = await getUserById(user.id);
        if(userFromId.authMethod !== "web")
            return h.response({
                error:`can't update user with email ${user.email}`
            }).code(409);
    
        await updateUser(user.id,name);
    
        return h.response({
            message:`successfully update user profile`
        }).code(200);
    } catch(err){
      console.error(err);
      return h
        .response({
          error: "something went wrong, please contact pocketwise support",
        })
        .code(500);
  }
}

async function updateUserEmail(request,h){
    try{
        const user = request.user;
    
        const { email } = request.payload;
    
        if(isInputInvalid(email))
            return h.response({
                error:"input is invalid"
            }).code(400);
    
        const userFromId = await getUserById(user.id);
        if(userFromId.authMethod !== "web")
            return h.response({
                error:`can't update user with email ${user.email}`
            }).code(409);
    
        const isEmailExist = await getUserByEmail(email);
        if (isEmailExist)
            return h.response({
                error:`email ${email} already being use`
            }).code(409);
    
        await updateEmail(user.id,email);
    
        return h.response({
            message:`successfully update user email ${email}`
        }).code(200);
    } catch(err){
      console.error(err);
      return h
        .response({
          error: "something went wrong, please contact pocketwise support",
        })
        .code(500);
  }
}

async function uploadProfileImage(request,h){
    try{
        const user = request.user;
        const data = request.payload;
        const image = data.image;
        
        if (!image || typeof image._read !== "function") {
            return h.response({ error: "Image is required and must be a file." }).code(400);
        }
    
        const chunks = [];
        for await (const chunk of image) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
    
        const mimeType = image.hapi.headers['content-type'];
        const ext = mimeType.split('/')[1] || 'bin';
        const filename = `${getUuidv4()}.${ext}`;
    
        const url = await uploadImageToStorage(filename,buffer);
    
        await updateUserProfileImage(user.id,url);
    
        return h
            .response({
            message: "successfully upload image profile",
            })
            .code(200);
    } catch(err){
      console.error(err);
      return h
        .response({
          error: "something went wrong, please contact pocketwise support",
        })
        .code(500);
  }
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    updateUserEmail,
    uploadProfileImage
}