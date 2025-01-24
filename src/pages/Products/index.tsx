import React, { FC, useEffect, useState } from "react"
import "./index.css"
import { useNavigate } from "react-router-dom"
import { api } from "../../axios";
import Pagination from '@mui/material/Pagination';

interface FilterProduct {
  categories: string[],
  companies: string[],
  pagination?: {
    total: number;
  }
}

interface Products {
  id: number | string
  attributes: {
    image: string
    title: string
    price: number
  }
}

interface ApiResponse {
  data: Products[]
  meta: FilterProduct
}

const Products: FC = () => {
  const [searchProduct, setSearchProduct] = useState<number | string>("")
  const [category, setCategory] = useState<string>("all")
  const [company, setCompany] = useState<string>("all")
  const [sort, setSort] = useState<string>("a-z")
  const [price, setPrice] = useState<number>(1000)
  const [filterProduct, setFilterProduct] = useState<FilterProduct>({ categories: [], companies: [] })
  const [shipping, setShipping] = useState<boolean>(false)
  const [products, setProducts] = useState<Products[]>([])
  const [paginationCount, setPaginationCount] = useState<number>(3)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])

  useEffect(() => {
    api.get<ApiResponse>(`products`)
      .then(response => {
        if (response.status == 200) {
          setProducts(response.data.data)
          setFilterProduct(response.data.meta)
        }
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  function fetchProducts(page: number) {
    api.get<ApiResponse>(`products?search=${searchProduct}&category=${category}&company=${company}&order=${sort}&page=${page}`)
      .then(response => {
        if (response.status == 200) {
          setProducts(response.data.data)
          setFilterProduct(response.data.meta)
          setPaginationCount(response.data.meta.pagination?.total || 1)
        }
      })
  }

  function handleSearchProduct(event: React.FormEvent) {
    event.preventDefault()

    api.get(`products?search=${searchProduct}&category=${category}&company=${company}&order=${sort}&page=${0}`)
      .then(response => {
        if (response.status == 200) {
          setProducts(response.data.data)
          setFilterProduct(response.data.meta)
        }
      })
      .catch(error => {
        console.log(error);
        navigate(`/products`)
      })
  }


  function handleReset(event: React.FormEvent) {
    event.preventDefault()

    api.get(`products`)
      .then(response => {
        if (response.status == 200) {
          setProducts(response.data.data)
          setFilterProduct(response.data.meta)
          setPrice(1000)
          setSearchProduct("")
          setCategory("all")
          setCompany("all")
          setSort("a-z")
        }
      })
      .catch(error => {
        console.log(error);
      })
  }


  function handleId(id: number | string) {
    navigate(`/products/${id}`)
  }


  function handlePageChange(event: React.ChangeEvent<unknown>, page: number) {
    event.preventDefault()
    setCurrentPage(page)
  }

  return (
    <div className="container-products">
      <div className="filter_products">
        <div className="filter-top">
          <form className="inputOne">
            <label htmlFor="searchProduct">Search Product</label>
            <input value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} id='searchProduct' type="text" />
          </form>

          <form className="inputTwo">
            <label htmlFor="selectCategory">Select Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} id="selectCategory">
              {filterProduct?.categories?.length > 0 ? (
                filterProduct.categories.map((value, index) => (
                  <option key={index} value={value}>{value}</option>
                ))
              ) : (
                <option value="all">Categoriya topilmadi!</option>
              )}
            </select>
          </form>

          <form className="inputThree">
            <label htmlFor="selectCompany">Select Company</label>
            <select value={company} onChange={(e) => setCompany(e.target.value)} id="selectCompany">
              {filterProduct?.companies?.length > 0 ? (
                filterProduct.companies.map((value, index) => (
                  <option key={index} value={value}>{value}</option>
                ))
              ) : (
                <option value={"all"}>Kompaniyalar topilmadi!</option>
              )}
            </select>
          </form>

          <form className="inputFour">
            <label htmlFor="sortBy">Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} id="sortBy">
              <option value="a-z">a-z</option>
              <option value="z-a">z-a</option>
              <option value="high">high</option>
              <option value="low">low</option>
            </select>
          </form>
        </div>

        <div className="filter-bottom">
          <div className="inputPrice">
            <div className="searchProduct">
              <label htmlFor="selectPrice">Select Price</label>
              <h4>${price.toFixed(2)}</h4>
            </div>
            <input max={1000} id='price' type="range" value={price} onChange={(e) => setPrice(Math.min(Number(e.target.value), 1000))} />
            <div className="search">
              <span>0</span>
              <strong>Max: $1,000.00</strong>
            </div>
          </div>

          <div className="inputPriceTwo">
            <label htmlFor="freeShipping">Free Shipping</label>
            <input checked={shipping} onChange={(e) => { setShipping(e.target.checked) }} className='checkbox' type="checkbox" />
          </div>

          <div className="searchButton">
            <button onClick={handleSearchProduct} className='one'>SEARCH</button>
            <button onClick={handleReset} className='two'>RESET</button>
          </div>
        </div>
      </div>

      <h2 className='howProducts'>{filterProduct.pagination && filterProduct.pagination.total} products</h2>
      <hr />

      <div className="containerProducts">
        {products.map((product, index) => (
          <div onClick={() => handleId(product.id)} key={index} className="card">
            <img src={product.attributes.image} alt="" />
            <h4>{product.attributes.title}</h4>
            <h5>${product.attributes.price}</h5>
          </div>
        ))}
      </div>

      <Pagination className="pagination" count={paginationCount} page={currentPage} onChange={handlePageChange} variant="outlined" shape="rounded" />
    </div>
  )
}

export default Products
