# Node.js Tutorial : Node.js로 웹서버 만들기

Web Browser ---- Web Server (Apache, Nginx...)

```javaScript
// main.js
const http = require("http");
const fs = require("fs");
const app = http.createServer((req, res) => {
    let url = req.url;
    if (req.url == "/") {
        url = "/index.html";
    }
    if (req.url == "/favicon.ico") {
        return res.writeHead(404);
    }

    res.writeHead(200);
    res.end(fs.readFileSync(__dirname + url))
})
app.listen(3000);
```

```bash
node main.js
```

위 명령어로 웹 서버 실행 시, `localhost:3000`에서 웹 페이지가 렌더링된 것을 확인할 수 있다. 해당 웹 서버 종료 시, 웹 페이지가 더이상 로드되지 않는 것을 알 수 있다. 즉, Node.js는 이곳에서 웹 서버 역할을 하고 있음.

```bash
console.log(__dirname + url)
# Nodejs/index.html ...
# Nodejs/coding.jpg ...
```

사용자 요청할 때마다 JavaScript를 통해서 파일을 읽는다.

```js
res.end("Hannah" + url);
```

`Hannah/index.html`처럼 현재 url과 함께 "Hannah"라는 문자열이 대신 읽힐 것이다.
이는 Apache는 하기 어렵지만, Python의 Django나 PHP, Node.js와 같은 웹서버가 할 수 있는 일이다. 즉, 프로그래밍적으로 사용자에게 전달할 데이터를 생성한다.

# URL

자바스크립트를 이용해서 Node.js가 갖고 있는 기능을 호출하면, 웹 애플리케이션을 Node.js로 만들게 된다. 웹 애플리케이션을 구현하는 테크닉 중 하나인 URL.

http://opentutorials.org:3000/main?id=HTML&page=12

- protocol (http, https와 같은 웹 브라우저와 웹 서버가 서로 통신하기 위한 규약)
- host(domain name)
- port
- path
- query string

## URL을 통해서 입력된 값 사용하기

URL 모듈은 URL 정보를 객체로 가져와 분석(parse)하거나 URL 객체를 문자열로 바꿔주는 기능(format, resolve)를 수행한다.

### `url.parse`

url 문자열을 url 객체로 변환해 리턴한다.

```js
url.parse(urlstr, [parseQueryString], [slashesDenoteHost]);
```

사용 예

```js
const url = require("url");
const urlObj = url.parse("http://localhost:3000/path");
console.log(urlObj); // url 객체 정보 출력
console.log(urlObj.format(urlObj)); // url 객체를 문자열로 출력
```


# 동적인 웹 페이지 만들기
- 의미론적인 변수명을 사용할 것
- 쿼리 스트링에 따라 template 내부의 자주 반복해 변화하는 부분들을 한 번에 처리할 수 있도록 함.


# Node.js의 파일 읽기 기능

```js
const fs = require("fs");
fs.readFile("sample.txt", "utf8", (err, data) => {
  console.log(data);
});
```

## `fs.readFile(path[,options],callback)`

path `<string> | <Buffer> | <URL> | <integer>` : finename or file descriptor

options `<Object> | <String>`

- encoding `<string> | <null>` : Default `null`
- flag `<string>` : Default `r`
  callback `<Function>`
- err `<Error>`
- data `<string> | <Buffer>`

Asynchronously reads the entire contents of a file

## 파일을 이용해 본문 구현

```js
const http = require("http");
const fs = require("fs");
const url = require("url");

const app = http.createServer((req, res) => {
  let _url = req.url;
  let queryData = url.parse(_url, true).query;
  let title = queryData.id;

  if (_url == "/") title = "Welcome";
  if (_url == "/favicon.ico") return res.writeHead(404);
  res.writeHead(200);

  // tips : path "./data/{title}"
  fs.readFile(`./data/${title}`, "utf8", (err, description) => {
    const template = `
        <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>`;
    res.end(template);
  });
});
app.listen(3000);
```

# Node.js 콘솔에서의 입력값

- Parameter : 입력되는 정보의 형식이 존재한다.
- Argument : 그 형식에 맞게 실제로 입력된 값

```js
let args = process.argv;
console.log(args);
```

```bash
node conditional.js <첫 번째 인자 값> <두 번째 인자 값>
[
  'Node가 설치된 경로',
  '실행 중인 파일의 경로',
  '첫 번째 인자 값',
  '두 번째 인자값'
]
```

# Not Found 구현

```js
console.log("URL PARSER", url.parse(_url, true));
```

```bash
URL PARSER Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: null,
  query: [Object: null prototype] {},
  pathname: '/favicon.ico',
  path: '/favicon.ico',
  href: '/favicon.ico'
}

```

```js
console.log("URL PARSER", url.parse(_url, true).pathname);
```

```bash
URL PARSER /
URL PARSER /favicon.ico
```

pathname은 querystring이 존재하더라도 해당 부분은 지우고 보여준다.
정상적인 root pathname 즉, "/"로 접근했을 때 보여지는 화면과 그렇지 않았을 때 보여지는 화면을 다르게 구성한다.

# Node.js에서 파일 목록 알아내기

## fs.readdir(path[, options], callback)

```js
const testFolder = "./tests/";
const fs = require("fs");

fs.readdir(testFolder, (err, files) => {
  files.forEach((file) => {
    console.log(file);
  });
});
```

- path `<string> | <Buffer> | <URL>`
- options `<string> | <Object>`
  - encoding `<string>` Default: 'utf8'
  - withFileTypes `<boolean>` Default: false
- callback `<Function>`
  - err `<Error>`
  - files `<string[]> | <Buffer[]> | <fs.Dirent[]>`

Asynchronous readdir(3) Reads the contents of a directory. The callback gets two arguments `(err, files)` where files in an array of the names of the files in the directory excluding `"."` and `".."`

The optional `options` argument can be a string specifying an encoding, or an object with an `encoding` property specifying the character encoding to use for the filenames passed to the callback. If the `encoding` is set to `buffer`, the filenames returned will be passed as `Buffer` objects.

If `options.withFileTypes` is set to `true`, the `files` array will contain fs.Dirent objects.

```js
let list = "";
filelist.forEach(file => {
    list += `<li><a href="/?id=${file}">${file}</a></li>`
})
```

# 함수를 이용해서 정리 정돈 하기
```js
const http = require("http");
const fs = require("fs");
const url = require("url");

function templateHTML(title, list, description) {
    return `<!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            <ul>${list}</ul>
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>`
}

function templateList(filelist) {
    let list = "";
    filelist.forEach(file => { 
        list += `<li><a href="/?id=${file}">${file}</a></li>`
    })
    return list;
}

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
                const list = templateList(filelist);
                const template = templateHTML(title, list, description);
                res.writeHead(200);
                res.end(template)
            })
        } else {
            fs.readdir("./data", (err, filelist) => {
                const list = templateList(filelist);
            fs.readFile(`./data/${queryData.id}`, "utf8", (err, description) => {
                const template = templateHTML(title, list, description);
                res.writeHead(200);
                res.end(template)
            })
        });
    }    
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
})
app.listen(3000);

```
- 함수를 이용해 반복되는 코드를 재사용하도록 해 코드의 양을 줄인다.

# Nodejs에서 동기와 비동기 (synchronous & asynchronous)
## fs.readFileSync(path[,options])
fs.readFile과 비교했을 때 callback이 없다. 
```js
const fs = require('fs');
console.log("A")
const result = fs.readFileSync("syntax/sample.txt", "utf8");
console.log(result);
console.log("C"); // A B C
```
반환값을 주는 fs.readFileSync()는 fs.readFile()과 비교했을 때 세 번째 인자인 콜백 함수가 존재하지 않는다. 

```js
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', (err, result) => {
    console.log(result);
});
console.log('C'); // A C B
```
fs.readFile()은 fs.readFileSync()와 비교했을 때 세 번째 인자로 콜백 함수를 가진다. 이 작업이 끝난 후 콜백 함수를 실행한다. 

# Node.js Package manager & PM2
```bash
npm install pm2 -g 
yarn global add pm2

pm2 start main.js
```
- yarn으로 등록 시 제대로 설치 진행이 안 되는 오류가 났음. 
- yarn remove 이후 npm으로 재설치. global로 설치해야 shell 상에서 pm2 커맨드를 사용할 수 있다. 

```bash
pm2 start main.js --watch 
```
위 커맨드 실행 후에는 소스 코드 변경 후 reload를 자동으로 해준다. 
```bash
pm2 log
```
실행 중 오류가 났을 때 로그를 보여준다.
[Reference](https://velog.io/@cckn/2019-11-05-0611-%EC%9E%91%EC%84%B1%EB%90%A8-17k2kwsgms)

# 글 생성 UI 만들기
컨텐츠 사용자가 직접 데이터를 생성하고 수정하고 전송하도록 한다. 

# POST 방식으로 전송된 데이터 받기
```js
else if (pathname === "/create_process") {
        let body = "";
        req.on("data", (data) => { // 웹 브라우저가 post 방식으로 데이터를 전송할 때, 데이터양이 방대할 때 Node.js에서는 그때를 대비해 이런 사용 방법을 제공한다. 특정한 양에 도달했을 때 조각조각의 양을 수신할 때마다 서버는 이 콜백 함수를 호출하도록 약속되어 있다. 
            body += data;
        })
        req.on("end", () => { // 들어올 정보가 없다면, 콜백 함수를 실행해 정보 수신을 끝낸다. 
            const post = qs.parse(body);
            const title = post.title
            const description = post.description            
        })

        res.writeHead(200);
        res.end("Success")
```

# 파일 생성과 리다이렉션
## fs.writeFile(file, data[, options], callback)


- file `<string> | <Buffer> | <URL> | <integer>` filename or file descriptor
- data `<string> | <Buffer> | <TypedArray> | <DataView>`
- options `<Object> | <string>`
    - encoding `<string> | <null>` Default: 'utf8'
    - mode `<integer>` Default: 0o666
    - flag `<string>` See support of file system flags. Default: 'w'.
- callback `<Function>`
    - err `<Error>`

When file is a filename, asynchronously writes data to the file, replacing the file if it already exists. data can be a string or a buffer.

When file is a file descriptor, the behavior is similar to calling `fs.write()` directly (which is recommended). See the notes below on using a file descriptor.

The `encoding` option is ignored if `data` is a buffer.

```js
fs.writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```

# 파일 수정  (Update)
## fs.rename(oldPath, newPath, callback)
- oldPath `<String> | <Buffer> | <URL>`
- newPath `<String> | <Buffer> | <URL>`
- callback `<Function>`
    - err `<Error>`

Asynchronously rename file at oldpath to the pathname provided as newPath. In the case that newPath exists, it will be overwrittern. If there is a directory at newPath, an error will be raised instead. No arguments other than a possible exception are given to the completion callback.

# 글 삭제 구현
```js
<a href="/update?id=${queryData.id}">Delete</a>
```
삭제 버튼을 구현할 때 `<a>` 태그로 구현하는 대신 `<form>`으로 구현한다. 

```js
<form action="/delete_process" method="post">
    <input type="hidden" name="id" value="${title}">
    <input type="submit" value="delete">
</form>
```
- Method에 주의한다. 
- `onsubmit()` 이벤트를 적용해 삭제 전 사용자의 의사를 다시 한 번 물어보는 프롬프트를 출력한다. 


## fs.unlink(path, callback)
- path `<string> | <Buffer> | <URL>`
- callback : `<Function>`
    - error `<Error>`

```js
// Assuming that 'path/file.txt' is a regular file.
fs.unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was deleted');
});
```
후에는 리다이렉션 -> Home으로 이동한다. 

# Module
```js
module.exports = {
    // ...
}
// or 
const A = {
    // ...
}
module.exports = A;
```

# Security
## path.parse(path)

```js
const id = post.id;
const filteredId = path.parse(id).base;
fs.unlink(`./data/${filteredId}`, (err) => {
    if (err) throw err;
    res.writeHead(302, {Location: "/"})
    res.end();
})
```

사용자로부터 입력 받을 수 있는 모든 경로들을 filteredId로 바꿔준다. 
path.parse(경로).base;

# 출력 정보에 대한 보안
사용자 입력 시 `<script>` 태그를 이용해 자바스크립트 코드를 심을 수 있다. 

웹 브라우저 자바스크립트에서는 `location.href = "경로"` 등으로 사용자의 현재 위치를 바꾸거나, 로그인 정보를 갈취하는 등의 부작용이 있을 수 있다. 

```js
sanitize() 
```
`<script>` 같은 문법은 무력화하고, `<h2>` 같은 태그는 해당 태그의 정보값은 살리는 방향으로 sanitize 한다. 

```js
// Allow only a super restricted set of tags and attributes
const clean = sanitizeHtml(dirty, {
  allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
  allowedAttributes: {
    'a': [ 'href' ]
  },
  allowedIframeHostnames: ['www.youtube.com']
});
```