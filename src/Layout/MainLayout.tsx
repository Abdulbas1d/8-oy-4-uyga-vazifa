import { FC, ReactNode } from 'react'
import './MainLayout.css'
import Header from '../components/Header'

interface MainLayoutProps {
    children: ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({children}) => {
  return (
    <div>
      <Header />

      {children}
    </div>
  )
}

export default MainLayout
