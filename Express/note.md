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