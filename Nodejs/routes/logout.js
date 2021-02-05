const express = require("express");
const router = express.Router();
const template = require("../lib/template");

router.get("/", (req, res) => {
        res.writeHead(302, {
            Location: `/`, 
            "Set-Cookie": [
                `email=; Max-Age=0`,
                `password=; Max-Age=0`,
                `nickname=; Max-Age=0`
            ]
        })
        res.end();
})
module.exports = router;