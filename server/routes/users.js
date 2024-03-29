var express = require('express');
var router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({
    message: 'respond with a resource'
  });
});

router.post("/create-checkout-session", async (req, res) => {
  console.log(req.body.items)
  const sql = req.sql ? req.sql : `SELECT * FROM Products WHERE product_id=${req.body.items[0].id}`

  try {
    const [result] = await res.app.db.query(sql);
    console.log('result', result)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: result[0].title,
            },
            unit_amount: result[0].price * 100,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `http://127.0.0.1:5500/client/success.html`,
      cancel_url: `http://127.0.0.1:5500/client/cancel.html`,
    })

    res.json({ url: session.url })
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: e.message })
  }
})


module.exports = router;
