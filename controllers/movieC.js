const { dbCon } = require('../configuration')
const { ObjectId } = require('bson')
const createError = require('http-errors')

const getMovies = (req, res, next) =>{

    console.log(req.user);

    const pageNumber = parseInt(req.params.page)

    if(isNaN(pageNumber)){
        return next(createError(400))
    }

    const moviesToSkip = (pageNumber - 1) * 10

    dbCon('movies', async (db) =>{
        try {
            const movies = await db.find({}).skip(moviesToSkip).limit(10).toArray()
            res.json(movies)
        } catch (error) {
            next(createError(500))
        }
    })
}

const getOneMovie = (req,res,next)=>{

    if(!ObjectId.isValid(req.params.id)){
        return next(createError(400))
    }

    const _id = new ObjectId(req.params.id)

    dbCon('movies', async (db) =>{
        try {
            const movie = await db.findOne({_id})
            if(!movie){
                return next(createError(404))
            }
            res.json(movie)
        } catch (error) {
            next(createError(500))
        }
    })
}

module.exports = {
    getMovies,
    getOneMovie
}