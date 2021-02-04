/*
function a(){
  console.log('A');
}
*/
const a = function() { // 익명  함수, 즉 이름이 없기 때문에 변수에 할당한다. 자바스크립트에서 함수는 인자로 들어갈 수 있다. 
  console.log('A');
}

a(); // 이렇게 함수를 실행할 수 있다. 


function slowfunc(callback){
  callback(); 
}

slowfunc(a); // "A" 를 출력한다. 인자로 들어간 callback 함수는 a()를 의미함.
