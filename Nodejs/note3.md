# TIL Node.js
## 1. 전역 변수 및 전역 객체
### Node.js의 전역 변수
프로그램 전역에서 사용할 수 있는 변수로, 프로그램 디버깅 시 사용할 수 있는 `__filename`, `__dirname`이 대표적이다. 
- `__filename` : 현재 실행 중인 코드의 파일 경로
-  `__dirname` : 현재 실행 중인 코드의 디렉토리 경로

### Node.js의 전역 객체
주요 전역 객체는 console, process, exports, require 등이 있다. 
- console : 
    - `console.log()`로 문자열 출력 시 사용 가능하다. 
    - `console.time()`, `console.timeEnd()`로 수행 시간을 확인할 수 있다. 
- process :
    - `process.argv` 실행 매개 변수를 갖는 프로퍼티. 
    - `process.env` : 컴퓨터의 환경 정보를 갖는 프로퍼티
- exports : 별도의 js 파일(모듈)에서 생성된 속성이나 메서드를 담아 내보내기한다. 
    ```js
    // nodejs/auth.js
    exports.IsOwner = function IsOwner(req, res) {
        // .. 
        return isOwner;
    }

    exports.AuthStatusUI = function AuthStatusUI(req, res) {
        // ..
        return authStatusUI;
    }
    ```
- require : 모듈을 추출할 때 사용한다.
    ```js
    const auth = require("./auth.js");
    auth.IsOwner(req, res);
    auth.AuthSatusUI(req, res)
    ```

[Reference Post](https://doitnow-man.tistory.com/157)

