const mongoose = require('mongoose')

mongoose.connect(process.env.mongooseUri, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true 
}
).then(() => {
}
).catch((e) => {
    
}
)

