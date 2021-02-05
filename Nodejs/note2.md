# 🙆‍♀️ Cookie & Authentication
Essential Concept for Cookie and Authentication

## Create Cookie
```js
const http = require("http");
http.createServer((req, res) => { 
    res.writeHead(200, { // 1
        "Set-Cookie": ["yummy_cookie=choco", "tasty_cookie=strawberry"]
    })
    res.end("Cookie!")
}).listen(3000)
```
- 간단한 웹 서버를 만들고, 쿠키를 만든다. DevTool > Network > Response Headers에서 등록된 쿠키를 확인할 수 있다. 
- 작성한 코드 (1) 부분을 주석처리하고 리로드 한 후에는 이번엔 Network > Request Headers의 쿠키 목록에 방금 전 등록한 쿠키가 여전히 서버로 요청되는 헤더에 포함된 것을 알 수 있다. 

## Read Cookie from Server-side
```js
const http = require("http");
http.createServer((req, res) => { 
    console.log(req.headers.cookie); // yummy_cookie=choco; tasty_cookie=strawberry
    res.writeHead(200, {
        "Set-Cookie": ["yummy_cookie=choco", "tasty_cookie=strawberry"]
    })
    res.end("Cookie!")
}).listen(3000)
```
[MDN HTTP Cookie](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)

# Cookie Parse를 위한 NPM Module
```bash
npm install cookie
```

```js
const cookie = require("cookie");
// ..
    console.log(req.headers.cookie) // yummy_cookie=choco; tasty_cookie=strawberry
    const cookies = cookie.parse(req.headers.cookie)
    console.log(cookies); // { yummy_cookie: 'choco', tasty_cookie: 'strawberry' }
    console.log(cookies.yummy_cookie); // choco

```
# Set-Cookie
## Session Cookie
웹 브라우저가 켜져 있는 경우 유효하다. 

## Permanent Cookie
웹 브라우저를 껐다 켰을 때 모두 유효하다. 
```js
res.writeHead(200, {
    "Set-Cookie": [
    "yummy_cookie=choco", "tasty_cookie=strawberry",
    `Permanent=cookies; Max-Age=${60*60*24*30}`
    ]
    // 한 달 간 유효한 쿠키
})
```

```js
"Secure=Secure; Secure" // Network Tap에서 Response Header에서 쿠키 값이 확인되지만, Request Headers에는 확인이 되지 않음.
```
## "Secure" (Optional)
Cookie is only sent to the server when a request is made with the `https:` scheme (except on localhost), and therefore is more resistent to man-in-the-middle attacks
- Note : DO not assume that `Secure` prevents all access to sensitive information in cookies (session keys, login details, etc). Cookies with this attribute can still be read/modified with access to the client's hard disk, or from JavaScript if the `HttpOnly` cookie attribute is not set. 

## "HttpOnly" (Optional)
Forbids JavaScript from accessing the cookie, for example through the `Document.cookie` property. 
- Note : a cookie that has been created with HttpOnly will still be sent with JavaScript-initiated requests, e.g. when calling `XMLHttpRequest.send()` or `fetch()`. This mitigates attacks against cross-site scripting(XSS)

## Path
특정 디렉토리 내에서만 쿠키가 활성화되도록 하고 싶을 때 사용할 수 있다. 
```js
 "Path=Path; Path=/cookie"
```
Chrome Browser > DevTool > Application 에서 확인해볼 수 있다. localhost:3000에 위치해 있을 때는 경로가 `/`로 설정된 모든 쿠키가 열람 가능하지만, localhost:3000/cookie에 위치해 있을 때는 경로가 `/cookie`로 설정된 쿠키인 Path도 열람이 된다. 

## Domain
```js
"Domain=Domain; Domain=o2.org"
```
`.o2.org`와 마찬가지여서 앞에 `test.o2.org` 같이 'test'라는 서브도메인이 와도, Domain이라는 쿠키는 유효하다. 

# 쿠키 인증 구현
```js
res.writeHead(302, {
    Location: `/`, 
    "Set-Cookie": [
        `someCookies=${someCookies}`,
    ]
})
res.end();
```
- 쿠키를 설정하고, 리다이렉션 경로를 설정한다. 
- status: 302 임시 이동

## 로그인 상태 체크
### Node.js Global Variable
```js
// main.js
app.use((req, res, next) => {
    app.set("global_variable", localVariable)
})

// routes/index.js
router.get(path, (req, res) => {
    const localInIndex = req.app.get("global_variable")
})
```
app.get, app.set을 이용해 전역 변수를 활용할 수 있다. 

## 로그인 상태를 UI에 반영
쿠키에 user의 로그인 값이 존재할 경우 `isOwner`라는 변수에 status 값을 담아 전역 변수로 활용할 수 있게 되었다. 
```js
// nodejs/auth.js
exports.IsOwner = function IsOwner(req, res) {
    let isOwner = false; // 
    let cookies = {};

    if (req.headers.cookie) { // if headers have cookie
        cookies = cookie.parse(req.headers.cookie);
    }
    if (cookies.email === "hannah28@gmail.com" && cookies.password === "0000") { // when user info is matched
        isOwner = true;
    }
    return isOwner;
}
// main_express.js에서 isOwner를 전역 변수화하는 middleware를 선언해두었다. 
exports.AuthStatusUI = function AuthStatusUI(req, res) {
    let authStatusUI = `<a href="/login">Login</a>` 
    if (req.app.get("isOwner")) { // req.app.get() 으로 전역변수를 프로젝트 내에서 사용할 수 있다.
        authStatusUI = `<a href="/logout">Logout</a>`
    }
    return authStatusUI;
}
// lib/template.js
html: function(title, list, body, control, authStatusUI) {
    // ..
    <body>
    ${authStatusUI} // body 태그 아래에 추가해준다. 
    // ..
}
```
routes 폴더 아래에서 template.js를 사용하는 미들웨어에 전역 변수로 선언해둔 `req.app.get("authStatusUI")`를 활용해 이전에 미리 선언해둔 html 변수를 조정한다. (새로운 authStatusUI를 추가한다)


## 로그아웃
UI 반영이 되었다면, 쿠키를 지워 로그아웃을 수행하는 로직을 위해 routes 아래에 logout.js를 생성한다. 
```js
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
```
로그인과 달리 `/logout` 라우터가 잡히면, redirection과 쿠키 삭제 로직만 작성한 뒤 마무리한다. 

## 접근 제어
create, update, delete 등의 기능을 로그인한 유저만 사용할 수 있도록 접근을 제어한다. 
```js
if (req.app.get("isOwner") === false) { // 인증된 사용자가 아닐 경우
    res.send(`Login Required <a href="/login">Go Login</a>`);
    return false;
}
```

# Summary & More
- 쿠키를 이용한 개인화 작업 (방문 횟수, 언어 설정, DarkMode)
- Session
- 쿠키에 비해 더 많은 데이터, 더 많은 기능을 수행할 수 있는 스토리지 : localStorage, Indexed DB
- 위 Sample Example은 암호화되지 않은 정보를 쿠키에 그대로 저장하지만, hash, salt, key stretching 등의 방법으로 암호화해 보호하는 방법이 존재한다. (사용 가능한 라이브러리 PBKDF2, bcrypt .. etc)
