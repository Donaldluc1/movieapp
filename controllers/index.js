const { postLogin } = require('./auth/login')
const { postSignup } = require('./auth/signup')
const { getMovies, getOneMovie } = require('./movieC')
const { postComment, putComment, deleteComment, getComments } = require('./commentC')

module.exports = {
    postLogin,
    getMovies,
    getOneMovie,
    postSignup,
    postComment,
    putComment,
    deleteComment,
    getComments
}