import Header from '../shared/widgets/header';
import './global.css';
import {Poppins,Roboto} from "next/font/google";

export const metadata = {
  title: 'Eshop',
  description: 'Eshop',
}

const roboto = 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Header/>
      <body>{children}</body>
    </html>
  )
}
