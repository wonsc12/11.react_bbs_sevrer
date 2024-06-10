const express = require('express');
const app = express();
const port = 8000;
const mysql = require('mysql');
const cors = require('cors');

var corsOptions = {
  origin: '*',  //* 모두허용
}

app.use(cors(corsOptions));

app.use(express.json())
app.use(express.urlencoded({extended: false}));


var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database:"react_bbs"
});

db.connect();

app.get('/list', (req, res) => {
  const Sql = "SELECT id,title, user_id, DATE_FORMAT(update_date, '%Y-%m-%d') AS update_date, DATE_FORMAT(date, '%Y-%m-%d') AS date  FROM board";
  db.query(Sql, function(err, result) {
     if (err) throw err;
    res.send(result);
  }); 

})

app.get('/detail', (req, res) => {
  const id = req.query.id; // get방식   post body
  const Sql = "SELECT title, content FROM board WHERE id=?";
  db.query(Sql,[id], function(err, result) {
     if (err) throw err;
    res.send(result);
  }); 

})

app.post('/insert', (req, res) => {
  /*
  let title = req.body.title;
  let content = req.body.content;
  */
  const {title,content} = req.body;
  console.log(title,content);
  let sql = "INSERT INTO board (title,content,user_id, update_date ) VALUES (?,?,'admin')";
  db.query(sql, [title, content], function(err, result) {
    if (err) throw err;
   res.send(result);
 }); 

})

app.post('/update', (req, res) => { //  req는 요청 객체를, res는 응답 객체
  /*
  let title = req.body.title;
  let content = req.body.content;
  */
  const {id,title,content} = req.body; // 클라이언트에서 보내온 게시글의 ID, 제목, 내용
  console.log(title,content);
  let sql = "UPDATE board SET title=?,content=? WHERE id=?"; // 이 쿼리는 board 테이블에서 특정 ID에 해당하는 행의 제목과 내용을 업데이트
  db.query(sql, [title, content , id], function(err, result) { // db.query 메서드를 사용하여 데이터베이스에 쿼리를 실행 ,  sql과 함께 배열 [title, content, id]를 전달하여 쿼리의 각 물음표(?) 자리마다 해당 값을 바인딩 , function(err, result) {...}는 콜백 함수로, 쿼리가 실행된 후 호출 , 
    if (err) throw err; // if (err) throw err;는 쿼리 실행 중 오류가 발생하면 예외를 발생
   res.send(result); // res.send(result);는 쿼리 실행 결과를 클라이언트에 응답으로 보냄
  }); 

})

app.post('/delete', (req, res) => {
  const id = req.body.boardIdList; // get방식   post body
  
  const Sql = `DELETE from board where id in (${id})`;
  console.log(id)
  db.query(Sql, function(err, result) {
     if (err) throw err;
    res.send(result);
  }); 

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})