const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

let db;

function connectWithRetry() {
  db = mysql.createConnection(dbConfig);
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(connectWithRetry, 5000); // retry every 5 seconds
    } else {
      console.log('Connected to MySQL');
    }
  });
}

connectWithRetry();

//Dashboard
//product
app.get('/product', (req, res) => {
  db.query('SELECT * FROM product', (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log("product",result)
    res.json(result);
  });
});
//dailynote
app.get('/daily_note', (req, res) => {
  db.query('SELECT * FROM daily_note', (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    //console.log("note",result)
    res.json(result);
  });
});

//Announcement.vue
//Addnotify
app.post('/addnotify', (req, res) => {
  const {category, createtime, content } = req.body;
  const query = 'INSERT INTO daily_note (category ,createtime,  content) VALUES (?, ?, ?)';
  db.query(query, [category,createtime, content], (err, result) => {
      if (err) {
          console.error('Error inserting form data:', err);
          return res.status(500).send(err);
      }
      res.json({ message: '通知建立成功' });
  });
});
//Deletenotify
app.delete('/profile/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM profile WHERE AccountID = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: '刪除成功' });
  });
});
//notevisibility
app.put('/daily_note/:createtime', async (req, res) => {
  const { createtime } = req.params;
  const updatedNote = req.body;
  console.log("time: ",createtime);
  console.log("update",updatedNote)
  try {
    const query = 'UPDATE daily_note SET category = ?, content = ?, shown = ? WHERE createtime = ?';
    const values = [updatedNote.category, updatedNote.content, updatedNote.shown, createtime];
    const result = await db.query(query, values);
    
    res.status(200).json({ success: true, message: 'Note updated successfully' });
  } catch (error) {
    console.error('Failed to update note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});
//editnotify
app.put('/edit_note/:createtime', async (req, res) => {
  const { createtime } = req.params;
  const updatedNote = req.body;
  console.log("time: ", createtime);
  console.log("update", updatedNote);
  
  try {
    const query = 'UPDATE daily_note SET category = ?, content = ?, shown = ? , createtime = ? WHERE createtime = ?';
    const values = [updatedNote.category, updatedNote.content, updatedNote.shown, updatedNote.createtime, createtime];
    console.log('Executing query:', query);
    console.log('With values:', values);

    const result = await db.query(query, values);
    console.log('Query result:', result);
    
    res.status(200).json({ success: true, message: 'Note updated successfully' });
  } catch (error) {
    console.error('Failed to update note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});


//Login.vue
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
        //有token版
        //const token = jwt.sign({ id: user.AccountID }, 'SECRET_KEY', { expiresIn: '1h' });
        //res.json({ message: '登入成功', token });

        res.json({ message: '登入成功', perm });
        //res.json('登入成功');
      } else {
        res.status(401).send('密碼錯');
      }
    } else {
      res.status(401).send('無此帳號');
    }
  });
});

//Person.vue 
app.get('/profile/:acID', (req, res) => {
  const acID = req.params.acID;
  db.query('SELECT * FROM profile WHERE AccountID = ?', [acID], (err, result) => {
    if (err) {
      return res.status(500).send(err);
      //return;
      console.log("nononononononon",err)
    }
    if (result.length === 0) {
      return res.status(404).json({ error: '未找到相关数据' });
    }
    res.json(result);
    console.log("有拿到資料了")
  });
});


//Form.vue
app.post('/form', (req, res) => {
  const { Num, AccountID, Email, Date, Content } = req.body;
  const query = 'INSERT INTO form (Num, AccountID, Email, Date, Content) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [Num, AccountID, Email, Date, Content], (err, result) => {
      if (err) {
          console.error('Error inserting form data:', err);
          return res.status(500).send(err);
      }
      res.json({ message: '表單發送成功' });
  });
});

//Register.vue
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
      console.log(hashedPassword)
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
//Accounts.vue

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
app.delete('/notify/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM daily_note WHERE createtime = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: '刪除成功' });
  });
});

// PUT (update) profile
// app.put('/profile/:id', (req, res) => {
//   const id = req.params.id;
//   const { Email, Permission } = req.body;
//   db.query('UPDATE profile SET Email = ?, Permission = ? WHERE AccountID = ?', [Email, Permission, id], (err, result) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     res.json({ message: '更新成功' });
//   });
// });

//Edit.vue
app.put('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const { Password, Email, Permission, isPasswordChanged } = req.body;

  // 檢查是否有必要的參數
  if (!Email || !Permission || !Password) {
    return res.status(400).json({ message: 'Email, Password 和Permission是必需的' });
  }

  let hashedPassword = Password;
  if (isPasswordChanged) {
    try {
      hashedPassword = await bcrypt.hash(Password, 10);
      console.log('now pss: ',hashedPassword)
    } catch (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send(err);
    }
  }

  //const hashedPassword = await bcrypt.hash(Password, 10);
  const query = 'UPDATE profile SET Email = ?, Password =? , Permission = ?   WHERE AccountID = ?';
  db.query(query, [Email, hashedPassword , Permission, id], (err, result) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      console.log("沒此人資料")
      return res.status(404).json({ message: '找不到該帳戶 ;;' });
    }
    console.log("更新成功")
    res.json({ message: '更新成功' });
  });
});


//Reportcheck.vue

// GET all forms
app.get('/forms', (req, res) => {
  db.query('SELECT * FROM form', (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});
//Delete form
app.delete('/forms/:num', (req, res) => {
  const { num } = req.params;
  const query = 'DELETE FROM form WHERE Num = ?';
  db.query(query, [num], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: '刪除成功' });
  });
});

//Monitor.vue
app.get('/vib', (req, res) => {
  db.query('SELECT * FROM vib_test', (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log("vib",result)
    res.json(result);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行在 port: ${PORT}`);
});
