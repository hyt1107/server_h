const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('連接失敗:', err.stack);
    return;
  }
  console.log('連接成功');
});

// Login.vue
app.post('/profile', (req, res) => {
  const { AccountID, Password } = req.body;

  db.query('SELECT * FROM profile WHERE AccountID = ?', [AccountID], async (err, result) => {
    if (err) {
      console.error('資料庫查詢失敗:', err);
      return res.status(500).send('資料庫查詢失敗');
    }
    if (result.length > 0) {
      const user = result[0];
      const perm = user.Permission;

      const isMatch = await bcrypt.compare(Password, user.Password);
      if (isMatch) {
        // 有token版
        // const token = jwt.sign({ id: user.AccountID }, 'SECRET_KEY', { expiresIn: '1h' });
        // res.json({ message: '登入成功', token });

        res.json({ message: '登入成功', perm });
        // res.json('登入成功');
      } else {
        res.status(401).send('密碼錯');
      }
    } else {
      res.status(401).send('無此帳號');
    }
  });
});

// Person.vue
app.get('/profile/:acID', (req, res) => {
  const acID = req.params.acID;
  db.query('SELECT * FROM profile WHERE AccountID = ?', [acID], (err, result) => {
    if (err) {
      return res.status(500).send(err);
      console.log("nononononononon", err)
    }
    if (result.length === 0) {
      return res.status(404).json({ error: '未找到相关数据' });
    }
    res.json(result);
    console.log("有拿到資料了")
  });
});

// Form.vue
app.post('/form', (req, res) => {
  const { AccountID, Email, Content } = req.body;

  const query = 'INSERT INTO form (AccountID, Email, Content) VALUES (?, ?, ?)';
  db.query(query, [AccountID, Email, Content], (err, result) => {
    if (err) {
      console.error('插入數據失敗:', err);
      return res.status(500).send('插入數據失敗');
    }
    res.json({ message: '數據插入成功' });
  });
});

// Register.vue
app.post('/register', async (req, res) => {
  const { AccountID, Password, Email, Permission } = req.body;

  db.query('SELECT * FROM profile WHERE AccountID = ?', [AccountID], async (err, result) => {
    if (err) {
      console.error('数据库查询失败:', err);
      return res.status(500).send('数据库查询失败');
    }
    if (result.length > 0) {
      return res.status(400).send('用户已存在');
    } else {
      const hashedPassword = await bcrypt.hash(Password, 10);
      const query = 'INSERT INTO profile (AccountID, Password, Email, Permission) VALUES (?, ?, ?, ?)';
      db.query(query, [AccountID, hashedPassword, Email, Permission], (err, result) => {
        if (err) {
          console.error('插入数据失败:', err);
          return res.status(500).send('插入数据失败');
        }
        res.json({ message: '注册成功' });
      });
    }
  });
});

// Accounts.vue

// GET all profiles
app.get('/profiles', (req, res) => {
  db.query('SELECT * FROM profile', (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// DELETE profile
app.delete('/profile/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM profile WHERE AccountID = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: '刪除成功' });
  });
});

// PUT (update) profile
app.put('/profile/:id', (req, res) => {
  const id = req.params.id;
  const { Email, Permission } = req.body;
  db.query('UPDATE profile SET Email = ?, Permission = ? WHERE AccountID = ?', [Email, Permission, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: '更新成功' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`伺服器運行在 port: ${PORT}`);
});
