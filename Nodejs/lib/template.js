module.exports = {
    html: function(title, list, body, control, authStatusUI) {
    return `<!doctype html>
            <html>
            <head>
            <title>WEB${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            ${authStatusUI}
            <h1><a href="/">WEB</a></h1>
            <ul>${list}</ul>
            ${control}
            ${body}
            </body>
            </html>`
        },
    list: function (filelist) {
            let list = "";
            filelist.forEach(file => { 
                list += `<li><a href="/topic/${file}">${file}</a></li>`
            })
            return list;
    }
}