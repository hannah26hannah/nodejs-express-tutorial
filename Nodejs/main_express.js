const express = require("express");
const app = express()
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require('compression');
const helmet = require("helmet");
app.use(helmet());
const cookie = require("cookie");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout")
const topicRouter = require("./routes/topic");

app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())

const auth = require("./nodejs/auth.js");

app.use((req, res, next) => {
    app.set("isOwner", auth.IsOwner(req, res))
    app.set("authStatusUI", auth.AuthStatusUI(req, res))
    next();
})

app.get("*", function (req, res, next) { 
    fs.readdir("./data", (err, filelist) => { 
        req.list = filelist;
        next();
    });
})


app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/topic", topicRouter);


app.use((req, res, next) => {
    res.status(404).send("Sorry can not find that!")
});

app.use((err, req, res, next) => { 
    console.error(err.stack)
    res.status(500).send("something broke!");
})


app.listen(3000, () => console.log("Example App Listening on Port 3000!"))