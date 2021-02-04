const testFolder = './data';
const fs = require('fs');

fs.readdir(testFolder, (error, filelist) => {
  console.log(filelist);
})

// "./"의 의미는 현재 디렉토리. 언제나 실행하는 경로에서 path를 생각해야 한다. 만일 Nodejs에서 node nodejs/readdir.js를 실행한다면, data는 Nodejs의 하위 폴더이므로 testFolder는 ./data로 충분하다. 또는 data도 가능하다. 