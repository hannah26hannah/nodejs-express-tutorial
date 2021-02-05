const express = require("express");
const router = express.Router();
const path = require("path");
const sanitizeHtml = require('sanitize-html');
const fs = require("fs");
const template = require("../lib/template.js");


router.get("/create", (req, res) => {
    if (req.app.get("isOwner") === false) { // 인증된 사용자가 아닐 경우
        res.send(`Login Required <a href="/login">Go Login</a>`);
        return false;
    } 
    const title = "Create";
    const list = template.list(req.list);
    const authStatusUI = req.app.get("authStatusUI");
    const html = template.html(title, list, `
        <form action="/topic/create" method="post">
            <p>
                <input type="text" name="title" placeholder="title">
            </p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit" value="submit">
            </p>
        </form>
        `, ``, `${authStatusUI}`
    );
    res.send(html)
})

router.post("/create", (req, res) => {
    if (req.app.get("isOwner") === false) { // 인증된 사용자가 아닐 경우
        res.send(`Login Required <a href="/login">Go Login</a>`);
        return false;
    }
    const post = req.body;
    const title = post.title;
    const description = post.description;
    fs.writeFile(`./data/${title}`, description, "utf8", (err) => { 
        if (err) throw err;
        res.redirect(`/topic/${title}`)
    })
})

router.get("/update/:pageId", (req, res) => {
    if (req.app.get("isOwner") === false) { // 인증된 사용자가 아닐 경우
        res.send(`Login Required <a href="/login">Go Login</a>`);
        return false;
    }
    const filteredId = path.parse(req.params.pageId).base
    fs.readFile(`./data/${filteredId}`, "utf8", (err, description) => {
        const title = req.params.pageId;
        const sanitizedTitle = sanitizeHtml(title)
        const sanitizedDescrription = sanitizeHtml(description, {
            allowedTags: [ 'b', 'i', 'em', 'strong', 'a'],
            allowedAttributes: {
                'a': ['href']
            }
        })
        const list = template.list(req.list);
        const authStatusUI = req.app.get("authStatusUI");
        const html = template.html(title, list, 
            `
            <form action="/topic/update" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <p>
                    <input type="text" name="title" placeholder="title" value="${sanitizedTitle}">
                </p>
                <p>
                    <textarea name="description" placeholder="description">${sanitizedDescrription}</textarea>
                </p>
                <p>
                    <input type="submit" value="submit">
                </p>
            </form>
            `,
            `<a href="/topic/create">Create</a> <a href="/topic/update/${filteredId}">Update</a>`,
            `${authStatusUI}`
        );
        res.send(html)
    })
})

router.post("/update", (req, res) => {
    if (req.app.get("isOwner") === false) { // 인증된 사용자가 아닐 경우
        res.send(`Login Required <a href="/login">Go Login</a>`);
        return false;
    }
    const post = req.body;
    const id = post.id;
    const title = post.title;
    const description = post.description;
    
    fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
        if (err) throw err;
        fs.writeFile(`data/${title}`, description, "utf8", (err) => {
            res.writeHead(302, {Location: `/topic/${title}`})
            res.end();
        })
    })
})

router.post("/delete", (req, res, err) => {
    if (req.app.get("isOwner") === false) { // 인증된 사용자가 아닐 경우
        res.send(`Login Required <a href="/login">Go Login</a>`);
        return false;
    }
    const post = req.body;
    const id = post.id;
    const filteredId = path.parse(id).base;
    fs.unlink(`./data/${filteredId}`, (err) => { 
        if (err) throw err;   
        res.redirect("/")
    })
})

router.get("/:pageId", (req, res, next) => {
    const filteredId = path.parse(req.params.pageId).base
    fs.readFile(`./data/${filteredId}`, "utf8", (err, description) => {
        if (err) { next(err); }
        else {
            const title = req.params.pageId;        
            const sanitizedTitle = sanitizeHtml(title)
            const sanitizedDescrription = sanitizeHtml(description, {
                allowedTags: [ 'b', 'i', 'em', 'strong', 'a'],
                allowedAttributes: {
                    'a': ['href']
                }
            })
            const list = template.list(req.list)
            const authStatusUI = req.app.get("authStatusUI");
            const html = template.html(title, list,
                    `<h2>${sanitizedTitle}</h2>${sanitizedDescrription}`,
                    `
                    <a href="/topic/create">Create</a> 
                    <a href="/topic/update/${sanitizedTitle}">Update</a>
                    <form action="/topic/delete" method="post">
                        <input type="hidden" name="id" value="${sanitizedTitle}">
                        <input type="submit" value="delete">
                    </form>
                    `,
                    `${authStatusUI}`);
            res.send(html)
        }
    })
})

module.exports = router;