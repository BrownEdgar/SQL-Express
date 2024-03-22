var express = require('express');
var router = express.Router();
const validColumnNames = ['title', 'price', 'quantity']

const checkSort = (req, res, next) => {
  const { sort, column } = req.query;

  if (sort && validColumnNames.includes(column)) {
    req.sql = `SELECT * FROM Products ORDER by ${column} ${sort}`
  }
  next()
}

router.get('/products', checkSort, async function (req, res) {
  console.log(req.sql)
  const sql = req.sql ? req.sql : `SELECT * FROM Products`
  try {
    const [result] = await res.app.db.query(sql);
    res.json(result)
  } catch (error) {
    console.log('error', error)
    res.json({ message: error.message })
  }
})


router.post('/products', async function (req, res, next) {
  const { body } = req;
  const { title, price, quantity } = body;
  const sql = `INSERT INTO Products (title, price, quantity) VALUES(?, ?, ?)`
  try {
    const [result, field] = await res.app.db.query(sql, [title, price, quantity]);
    res.json(result)
  } catch (error) {
    res.json({ message: error.message })
  }
})

router.patch('/products', async function (req, res, next) {
  const { id } = req.query;
  const { body } = req;
  const { title } = body;
  console.log(id, body)
  const sql = `UPDATE Products SET title = ? WHERE product_id = ?`
  try {
    const [result] = await res.app.db.query(sql, [title, id]);
    res.json(result)
  } catch (error) {
    res.json({ message: error.message })
  }

})

router.delete('/products/:id', async function (req, res, next) {
  const { id } = req.params;
  const sql = `DELETE FROM Products WHERE product_id = ?`
  try {
    const [result, field] = await res.app.db.query(sql, id);
    res.json(result)
  } catch (error) {
    res.json({ message: error.message })
  }
})

module.exports = router;
