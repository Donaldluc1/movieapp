const { dbCon } = require('../configuration')
const { userValidator, logSchema } = require('../validator')
const { hashSync, compareSync } = require('bcryptjs')

class User{
    constructor(userData){
        this.userData = {...userData}
    }

    save(cb){
        dbCon('users', async (db)=>{
            try {
                const hashedPass = hashSync(this.userData['password'], 12)
                this.userData['password'] = hashedPass
                await db.insertOne(this.userData)
                cb()
            } catch (err) {
                cb(err)
            }
        })
    }

    checkExistence(){
        return new Promise((resolve,reject)=>{
            dbCon('users', async (db)=>{
                try {
                    const user = await db.findOne({'$or': [{username: this.userData['username']}, {email: this.userData['email']}]})
                    if(!user){
                        resolve({
                            check: false
                        })
                    }else if(this.userData['username'] === user.username){
                        resolve({
                            check: true,
                            message: 'This username is already in use'
                        })
                    }else if(this.userData['email'] === user.email){
                        resolve({
                            check: true,
                            message: 'This email is already in use'
                        })
                    }
                } catch (error) {
                    reject(error)
                }
                
            })
        })
    }

    static validate(userData){
        return userValidator.validate(userData)
    }

    static login(userData){
        return new Promise((resolve,reject) =>{

            //Validation
            const validation = logSchema.validate(userData)
            if(validation.error){
                const error = new Error(validation.error.message)
                error.statusCode = 400
                return resolve(error)
            }

            dbCon('users', async (db)=>{
                try {
                    //find user
                    const user = await db.findOne({'$or': [{username: userData['username']}, {email: userData['username']}]}, {projection: {
                        username: 1,
                        password: 1,
                        email: 1
                    }})
                    if(!user || !compareSync(userData['password'], user.password)){
                        const error = new Error('Please enter valid username and password')
                        error.statusCode = 404
                        return resolve(error)
                    }

                    resolve(user)

                } catch (err) {
                    reject(err)
                }
            })
        })
    }
}

module.exports = User
