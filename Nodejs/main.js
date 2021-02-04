const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const template = require("./lib/template.js");
const path = require("path");
const sanitizeHtml = require('sanitize-html');

const app = http.createServer((req, res) => {
    let _url = req.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
     
    if (pathname === "/") {
        let title = queryData.id;
        if (queryData.id ===  undefined) {
            fs.readdir("./data", (err, filelist) => {
                title = "Welcome";
                description = "Hello, Node.js!"
                const list = template.list(filelist);
                const html = template.html(title, list, `<h2>${title}</h2>${description}`,
                `<a href="/create">Create</a>`
                );
                res.writeHead(200);
                res.end(html)
            })
        } else {
            fs.readdir("./data", (err, filelist) => {
                const filteredId = path.parse(queryData.id).base
                fs.readFile(`./data/${filteredId}`, "utf8", (err, description) => {
                const sanitizedTitle = sanitizeHtml(title)
                const sanitizedDescrription = sanitizeHtml(description, {
                    allowedTags: [ 'b', 'i', 'em', 'strong', 'a'],
                    allowedAttributes: {
                        'a': ['href']
                    }
                })
                const list = template.list(filelist)
                const html = template.html(title, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescrription}`,
                `
                <a href="/create">Create</a> 
                <a href="/update?id=${sanitizedTitle}">Update</a>
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>
                `
                );
                res.writeHead(200);
                res.end(html)
            })
            });
        }    
    } else if (pathname === "/create") {
        fs.readdir("./data", (err, filelist) => {
            title = "Create";
            
            const list = template.list(filelist);
            const html = template.html(title, list, `
                <form action="/create_process" method="post">
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
            res.writeHead(200);
            res.end(html)
        })
    } else if (pathname === "/create_process") {
        let body = "";
        req.on("data", (data) => { body += data; })
        req.on("end", () => {
            const post = qs.parse(body);
            const title = post.title
            const description = post.description            
            fs.writeFile(`./data/${title}`, description, "utf8", (err) => {
                if (err) throw err;
                res.writeHead(302, {Location: `/?id=${title}`});
                res.end()
            })
        })

    } else if (pathname === "/update") {
        fs.readdir("./data", (err, filelist) => {
            const filteredId = path.parse(queryData.id).base
            fs.readFile(`./data/${filteredId}`, "utf8", (err, description) => {
                const title = queryData.id;
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
                    <form action="/update_process" method="post">
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
                    `<a href="/create">Create</a> <a href="/update?id=${filteredId}">Update</a>`
                );
                res.writeHead(200);
                res.end(html)
            })
            });
    } else if (pathname === "/update_process") {
        let body = "";
        req.on("data", (data) => { body += data; })
        req.on("end", () => {
            const post = qs.parse(body);
            const id = post.id;
            const title = post.title;
            const description = post.description;
            console.log(post);
            fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
                if (err) throw err;
                fs.writeFile(`data/${title}`, description, "utf8", (err) => {
                    res.writeHead(302, {Location: `/?id=${title}`})
                    res.end();
                })
            })
        })

    } else if (pathname === "/delete_process") {
        let body = "";
        req.on("data", (data) => { body += data; })
        req.on("end", () => {
            const post = qs.parse(body);
            const id = post.id;
            const filteredId = path.parse(id).base;
            fs.unlink(`./data/${filteredId}`, (err) => {
                if (err) throw err;
                res.writeHead(302, {Location: "/"})
                res.end();
            })
        })
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
})
app.listen(3000);
