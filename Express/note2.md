# Express Tutorial 3
📁 express-generator

## Set up for development
```bash
npx express-generator
```
`package.json`에 express 프로젝트를 위한 dependencies이 준비되어 있다. 
```bash
npm install
```

```bash
# run the app
SET DEBUG=express:* & npm start
```

## Summary & More
Node.js의 web framework인 express로 할 수 있는 일
- Express와 자주 사용되는 template engine 'pug'
    ```bash
    # pug를 쓰고자 한다면, 
    npm install pug --save
    ```
- Express는 자체적인 Database driver를 제공하지는 않는다. Express 내 Guide -> DB Integration > 주요 데이터베이스 별 통합 방법에 대한 예제 존재
- Middleware는 Express의 essential concept. Read Guide > Middle Ware part documents


