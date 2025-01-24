import React, { createContext, FC, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './Layout/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'

interface CountCart {
  count: number
  setCount: React.Dispatch<React.SetStateAction<number>>
}

export const CountCart = createContext<CountCart | null>(null)

const App: FC = () => {
  const [count, setCount] = useState<number>(0)

  return (
    <div>
      <CountCart.Provider value={{ count, setCount }}>
        <Routes>
          <Route index element={<MainLayout><Home /></MainLayout>} />
          <Route path='/about' element={<MainLayout><About /></MainLayout>} />
          <Route path='/products' element={<MainLayout><Products /></MainLayout>} />
          <Route path="/products/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
          <Route path='/cart' element={<MainLayout><Cart /></MainLayout>} />
        </Routes>
      </CountCart.Provider>
    </div>
  )
}

export default App
