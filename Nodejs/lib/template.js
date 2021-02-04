module.exports = {
    html: function(title, list, body, control) {
    return `<!doctype html>
            <html>
            <head>
            <title>WEB ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB2</a></h1>
            <ul>${list}</ul>
            ${control}
            ${body}
            </body>
            </html>`
        },
    list: function (filelist) {
            let list = "";
            filelist.forEach(file => { 
                list += `<li><a href="/?id=${file}">${file}</a></li>`
            })
            return list;
    }
}