var mongoose =  require('mongoose'),
    Schema =    mongoose.Schema

    articleSchema = new Schema({
        title: String,
        date: Date,
        content: String,
    }),

    linkSchema = new Schema({
        name: String,
        href: String,
        newPage: Boolean
    }),

    userSchema = new Schema({
        name: String,
        password: String,
        email: String,
        emailCode: String,
        createdTime: Number,
        articles: [articleSchema],
        links: [linkSchema]
    }),

    User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://localhost/platform')
mongoose.set('debug', true)

var db = mongoose.connection
db.on('error', function () {
    console.log('db error'.error)
})
db.once('open', function () {
    console.log('db opened'.silly)
})

module.exports = {
    User: User
}