import Dashboard from '@/conponents/Dashbord'
import { ChakraProvider, Heading } from '@chakra-ui/react'
import Image from 'next/image'

export default function Home() {
  return (
    <ChakraProvider>
      <main className="flex min-h-screen items-center justify-around p-10 flex-col " style={{backgroundColor:'darkblue'}}>
        <Heading fontSize={'56px'} fontWeight={'900'} color={'white'} mb={'60px'}>UNDERWATER SENSORS</Heading>
        <Dashboard />
      </main>

    </ChakraProvider>

  )
}
