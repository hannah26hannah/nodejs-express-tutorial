const express = require("express");
const app = express()
const fs = require("fs");
const template = require("./lib/template.js");
const qs = require("querystring");
const path = require("path");
const bodyParser = require("body-parser");
const sanitizeHtml = require('sanitize-html');

app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => { 
    fs.readdir("./data", (err, filelist) => {
        const title = "Welcome";
        const description = "Hello, Node.js!"
        const list = template.list(filelist);
        const html = template.html(title, list, `<h2>${title}</h2>${description}`,
        `<a href="/create">Create</a>`
        );
        res.send(html)
    })
})

app.get("/page/:pageId", (req, res) => {
    fs.readdir("./data", (err, filelist) => {
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
        const list = template.list(filelist)
        const html = template.html(title, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescrription}`,
                `
                <a href="/create">Create</a> 
                <a href="/update/${sanitizedTitle}">Update</a>
                <form action="/delete" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>
        `);
        res.send(html)
    })
    });
})

app.get("/create", (req, res) => { 
    fs.readdir("./data", (err, filelist) => {
        const title = "Create";
        
        const list = template.list(filelist);
        const html = template.html(title, list, `
            <form action="/create" method="post">
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
            `, ``
        );
        res.send(html)
    })
})

app.post("/create", (req, res) => { 
    const post = req.body;
    const title = post.title;
    const description = post.description;
    fs.writeFile(`./data/${title}`, description, "utf8", (err) => { 
        if (err) throw err;
        res.redirect(`/page/${title}`)
    })
})

app.get("/update/:pageId", (req, res) => {
    fs.readdir("./data", (err, filelist) => {
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
            const list = template.list(filelist);
            const html = template.html(title, list, 
                `
                <form action="/update" method="post">
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
                `<a href="/create">Create</a> <a href="/update/${filteredId}">Update</a>`
            );
            res.send(html)
        })
    });
})

app.post("/update", (req, res) => { 
    const post = req.body;
    const id = post.id;
    const title = post.title;
    const description = post.description;
    
    fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
        if (err) throw err;
        fs.writeFile(`data/${title}`, description, "utf8", (err) => {
            res.writeHead(302, {Location: `/page/${title}`})
            res.end();
        })
    })
})

app.post("/delete", (req, res) => { 
    const post = req.body;
    const id = post.id;
    const filteredId = path.parse(id).base;
    fs.unlink(`./data/${filteredId}`, (err) => {
        if (err) throw err;   
        res.redirect("/")
    })
})
app.listen(3000, () => console.log("Example App Listening on Port 3000!"))