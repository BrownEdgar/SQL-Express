import React, { useEffect, useState } from 'react'
import './App.css'
import Loader from './conponents/Loaders/Loader';

export default function App() {

  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(false)

  const getAll = async () => {
    const response = await fetch('http://localhost:3000/products')
    const data = await response.json();
    console.log(data)
    setproducts(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { title, price, quantity } = e.target;
    const product = {
      title: title.value,
      price: price.value,
      quantity: quantity.value
    }
    fetch('http://localhost:3000/products', {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err))
      .finally(() => e.target.reset())
  }

  useEffect(() => {
    getAll()
  }, [loading])

  const sortBy = (column) => {
    setLoading(true)
    fetch(`http://localhost:3000/products?sort=${column}`, {
      method: "GET",

    }).then(res => res.json())
      .then(data => setproducts(data))
      .catch(err => console.log(err))
      .finally(() => {
        setTimeout(setLoading, 1000, false)
      })

  }
  const deleteProductById = (id) => {
    setLoading(true)
    fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(res => res.json())
      .then(getAll)
      .catch(err => console.log(err))
      .finally(() => {
        setTimeout(setLoading, 1000, false)
      })
  }

  return (
    <div className='App'>
      <h1>Full stack demo</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" name='title' required placeholder='title' />
        <input type="number" name='price' required min={1} placeholder='price' />
        <input type="number" name='quantity' required min={1} placeholder='quantity' />
        <input type="submit" value='Add Product' />
      </form>
      <hr />

      <table className={loading ? 'blur' : ''}>
        {loading ? <Loader /> : null}
        <thead >
          <tr>
            <th>N</th>
            <th>
              Title
              <i className="bi bi-sort-up" onClick={() => sortBy('title')}></i>
            </th>
            <th>
              price
              <i className="bi bi-sort-up" onClick={() => sortBy('price')}></i>
            </th>
            <th>
              quantity
              <i className="bi bi-sort-up" onClick={() => sortBy('quantity')}></i>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((elem, index) => {
            return (
              <tr key={elem.product_id}>
                <td>{index + 1}</td>
                <td>{elem.title}</td>
                <td>{elem.price}</td>
                <td>{elem.quantity}</td>
                <td>
                  <button className='del-btn' onClick={() => deleteProductById(elem.product_id)}>
                    &#10006;
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
