const express = require("express");
const router = express.Router();
const template = require("../lib/template");

router.get("/", (req, res) => { 
    const title = "Welcome";
    const description = "Hello, Node.js!"
    const list = template.list(req.list);
    const html = template.html(title, list, `
    <h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:100vh; display:block">
    `,
    `<a href="/topic/create">Create</a>`
    );
    res.send(html)
})

module.exports = router;