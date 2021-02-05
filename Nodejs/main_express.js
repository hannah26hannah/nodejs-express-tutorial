const express = require("express");
const app = express()
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require('compression');
const indexRouter = require("./routes/index.js");
const topicRouter = require("./routes/topic");
    
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
app.get("*", function (req, res, next) { 
    fs.readdir("./data", (err, filelist) => { 
        req.list = filelist;
        next();
    });
})

app.use("/", indexRouter); // /로 시작되는 주소에게 indexRouter라는 미들웨어를 적용한다. 
app.use("/topic", topicRouter); // /topic으로 시작되는 주소들에게 topicRouter라는 미들웨어를 적용한다. 


app.use((req, res, next) => {
    res.status(404).send("Sorry can not find that!")
});

app.use((err, req, res, next) => { 
    console.error(err.stack)
    res.status(500).send("something broke!");
})


app.listen(3000, () => console.log("Example App Listening on Port 3000!"))