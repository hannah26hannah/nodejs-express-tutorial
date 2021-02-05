const express = require("express");
const router = express.Router();
const template = require("../lib/template");

router.get("/", (req, res) => { 
    const title = "Login";
    const list = template.list(req.list);
    const authStatusUI = req.app.get("authStatusUI");
    const html = template.html(title, list, 
        `
        <form action="login" method="post">
            <p>
                <input type="text" name="email" placeholder="email">
            </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit" value="submit">
            </p>
        </form>
    `,
    `<a href="/topic/create">Create</a>`,
    `${authStatusUI}`
    );
    res.send(html)
})

router.post("/", (req, res) => {
    const post = req.body;
    const email = post.email;
    const password = post.password;
    if (email === "hannah28@gmail.com" && password === "0000") {
        res.writeHead(302, {
            Location: `/`, 
            "Set-Cookie": [
                `email=${email}`,
                `password=${password}`,
                `nickname=hannah`
            ]
        })
        res.end();
    } else {
        res.send(`Try Again! <a href="/login">Go Back To Login</a>`);
    }
})
module.exports = router;