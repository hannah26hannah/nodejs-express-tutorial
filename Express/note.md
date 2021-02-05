# Express Tutorial 1

📁 Node.js 프로젝트를 express로 개선하는 튜토리얼

## Set up for development
```bash
npm install express --save
```
로컬 환경에서 express 설치

## Hello World
```js
app.get("/", (req, res) => { 
    res.send("Get request to homepage");
})
```
### `app.get(path, callback [, callback ...])`

Routes HTTP GET requests to the specified path with the specified callback functions.
- path : The Path for which the middleware function is invoked; can be any of 
    - A String representing a path
    - A path pattern
    - A regular expression pattern to match paths.
    - An array of combinations of any of the above
- callback : callback functions; can be
    - A middleware function
    - A series of middleware function (separated by commas)
    - An array of middleware functions
    - A combination of all of the above

```js
app.get("/", (req, res) => { 
    res.send("Hello World");
})
app.get("/page", (req, res) => { 
    res.send("Hello page");
})
app.listen(3000, () => console.log("Example App Listening on Port 3000!"))
```
- 기존 Node.js 예제에서 복잡하게 분기했던 routing을 app.get() 메소드의 첫 번째 argument로 대체해서 쓸 수 있다. 
- app.listen() 메소드가 실행되면 첫 번째 인자인 포트 넘버를 받아 비로소 웹 서버가 실행됨

## 홈페이지 구현
```js
// Node.js Example
res.writeHead(200);
res.end(html)
```

```js
// Express Example
res.send(html)
```
기존에는 http 모듈의 createServer()의 req, res를 공유하는 상황이 많아 실제로 쓰이는 곳과 제공해주는 부분 사이의 거리가 멀었는데, 개선된 코드에서는 각각 req, res를 구현한다. 


### Route Parameters
```js
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```
Route Parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured values are populated in the `req.params` object, with the name of the route parameter specified in the path as their respective keys.

```js
app.get("/page/:pageId", (req, res) => { 
    res.send(req.params);
})

// http://localhost:3000/page/CSS/3
// pageId: CSS
// chapterId: 3
```

## Page Create
```js
app.post(path, callback [, callback ...])

app.post('/', function (req, res) {
  res.send('POST request to homepage')
})
```
Routes HTTP POST requests to the specified path with the specified callback functions.

```js
// Node.js Example

if (pathname === "/create") { // ... 
}
if (pathname === "/create_process") { // ... 
}

// Express Example
app.get("/create", (req, res) => {
    // .. 
})
app.post("/create", (req, res) => {
    // .. 
})

// when method is different pathname wouldn't matter
```

## Page Update/Delete
```js
app.get("/update/:pageId", (req, res) => { })
app.post("/update/:pageId", (req, res) => { })
app.post("/delete", (req, res) => { }
```

## Redirection
```js
// Node.js Example
res.writeHead(302, {Location: "/"})
res.end();

// Express Example
res.redirect("/")
```

# Express Tutorial 2
📁 express 톺아보기
## MiddleWare - body-parser
There are two import parts for Express:Router and Middleware.
- body-parser : Parse HTTP request body
- cors
- morgan
- ...etc

기존 post 방식을 body-parser를 이용해 여러 문제를 해결하거나 코드를 좀 더 깔끔하게 관리할 수 있다. 
```bash
npm install body-parser --save
```

bodyParser를 로드한다.
```js
const bodyParser = require("body-parser");
```


```js
// parse application/x-www-form-urlencoded - Form Data의 경우
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json의 경우
app.use(bodyParser.json())
```
 - bodyParser가 만들어내는 미들웨어를 표현하는 표현식. - main_express.js가 실행될 때마다, 즉, 사용자가 요청할 때마다 이 미들웨어가 실행되며 내부적으로 사용자가 전송한 post 메소드를 분석해서 해당 경로에 해당되는 콜백을 호출하도록 한다. 
 - 호출하면서, `request`의 첫 번째 인자인 `body`라는 property를 생성한다. (기존에는 존재하지 않았음)

```js
// Before using Middleware
let body = "";
req.on("data", (data) => { body += data; })
req.on("end", () => {
    const post = qs.parse(body);
    const title = post.title
    const description = post.description            
    fs.writeFile(`./data/${title}`, description, "utf8", (err) => {
        if (err) throw err;
        res.redirect(`/page/${title}`)
    })
})
```

```js
// After using Middleware
const post = req.body;
const title = post.title;
const description = post.description;
fs.writeFile(`./data/${title}`, description, "utf8", (err) => { 
    if (err) throw err;
    res.redirect(`/page/${title}`)
})
```
## MiddleWare - Compression
```bash
npm install compression --save
```

```js
const compression = require('compression');
app.use(compression())
```

## Writing MiddleWare
```js
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000)
```
공통적으로 사용되고 있는 로직이 있다. 이 로직을 미들웨어로서 처리할 수 있다. 

```js
app.use(function (req, res, next) { 
    fs.readdir("./data", (err, filelist) => { 
        req.list = filelist;
        next();
    });
})
```
그러나 이 경우 해당 로직이 필요하지 않은 요청에 대해서도 middleware를 사용하는 상황이 되므로 비효율적이다. 아래처럼 개선해줄 수 있다. 

```js
app.get("*", function (req, res, next) { 
    fs.readdir("./data", (err, filelist) => { 
        req.list = filelist;
        next();
    });
})
```
get 방식에 대해서만 해당 middleware를 실행한다. 

```js
app.post("/create", (req, res) => { 
    console.log("post 일 때", req.list) // undefined
} 
```
post 방식일 때는 해당 middleware가 작동하지 않는 것을 알 수 있다. 

## Using MiddleWare
### Application-level middleware
```js
var express = require('express')
var app = express()

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next() // 이 다음의 미들웨어가 실행될지 말지를 그 이전의 미들웨어가 결정하는 셈
})
```
특정 경로에서만 미들웨어가 동작하도록 한다. 
```js
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
```
미들웨어를 여러 개 붙여서 사용할 수도 있다. 
```js
app.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next() // 바로 뒤이어 나오는 아래 미들웨어를 실행하는 것과 다름없다.
}, function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
```

두 개의 미들웨어, 하나의 미들웨어
```js
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id) // 1
  next()
}, function (req, res, next) { // 2
  res.send('User Info')
})

// handler for the /user/:id path, which prints the user ID
app.get('/user/:id', function (req, res, next) { // 3
  res.end(req.params.id) 
})
```
1번이 호출되고, 2번이 호출되고, 그리고 next()가 쓰이지 않았으므로 3은 호출되지 않는다. 

또한 조건문으로 분기를 주고 다양하게 next()를 호출할 수도 있다.
```js
app.get('/user/:id', function (req, res, next) {
  if (req.params.id === '0') next('route') // 1
  else next()
}, function (req, res, next) { // 2
  res.send('regular')
})

app.get('/user/:id', function (req, res, next) { //3
  res.send('special')
})
```
1의 조건을 만족하면, 인자를 갖는 next('route')의 호출에 따라 3이 실행되고, 그렇지 않으면 2가 실행될 것이다. 

## Serving Static files
```js
app.use(express.static("public")); 
```
지정한 폴더(public) 내에서 static files를 찾기 때문에 더욱 안전하게 파일들에 접근이 가능하다. 

## Error Handling
### 존재하지 않는 파일
```js
fs.readFile(path, "utf8", (err, data) => {
  if (err) {
    next(err);
  }
})
```
### 404 Error 
```js
app.use((req, res, next) => {
    res.status(404).send("Sorry can not find that!")
});
```
- 미들웨어는 순차적으로 실행됨 
- Not Found로 인해 아무것도 처리하지 못할 경우를 위해 코드 하단에 작성한다.

### Writing Error Handlers
```js
app.use((err, req, res, next) => { 
    console.error(err.stack)
    res.status(500).send("something broke!");
})
```
next(err)가 실행된 경우 가운데 쓰인 다른 미들웨어는 무시되고, 위에 적은 에러 핸들러가 실행된다. (첫 번째 인자가 err, 총 인자는 네 개가 존재한다.)

1. 에러가 존재할 경우 next(err) 처럼 인자를 가진 next()를 호출한다. 
2. 인자의 값이 있는 경우에는 node.js는 인자가 네 개인 함수가 등록된 미들웨어를 호출된다. 
3. 해당 미들웨어를 통해 최종적으로 에러 처리를 할 수 있게 된다. 

## 라우터 (주소체계변경)
서로 연관된 라우터들을 따로 모듈로 만들어 정리할 수 있다. 
```js
// main_express.js
const express = require("express");
const app = express()

// topic.js
const express = require("express");
const router = express.Router();

// ...

// before : app.get("/topic/create", (req, res) => {})
router.get("/create", (req, res) => { 
  // ..
}); 
module.exports = router;
```
## Security
- Don't use deprecated or vulnerable versions of Express
- Use TLS
- Use Helmet (보안과 관련해서 일어날 수 있는 대표적 보안 이슈를 자동으로 해결해주는 모듈)
  ```hash
  npm install --save helmet
  ```
  ```js
  const helmet = require("helmet");
  app.use(helmet());
  ```
  - 옵션을 이용해 더 세밀하게 보안을 조정할 수 있다. 
- Use Cookies securely
- Ensure your dependencies are secure

  ```bash
  npm i nsp -g
  ```

  - 의존성의 취약점을 관리하도록 도와준다. 
  기존에는 아래 명령어로 관리되었다. 

  ```bash
  nsp check # from
  ```

  아래 같은 사유로 인한 업데이트로 명령어가 바뀌었다. 

  > "Beginning with npm@6, a new command, `npm audit`, recursively analyzes your dependency trees to identify specifically what's insecure, recommend a replacement, or fix it automatically with `npm audit fix`
  ```bash
  npm audit --audit-level high # to
  ```
  [Node Security service shutdown: getaddrinfo ENOTFOUND api.nodesecurity.io](https://stackoverflow.com/questions/53716991/node-security-service-shutdown-getaddrinfo-enotfound-api-nodesecurity-io)