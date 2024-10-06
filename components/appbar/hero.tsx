import React from 'react'
import { Button } from '../ui/button'
import { TrendingUp } from 'lucide-react'

const Hero = () => {
  return (
    <main className='max-w-4xl lg:max-w-7xl mx-auto p-6 mt-20'>
      <div>
        <h1 className='text-3xl md:text-6xl font-semibold tracking-tight'>Launch. Share. Grow.</h1>
        <p className='mt-2 text-sm md:text-base text-muted-foreground leading-tight'>Seamlessly launch your project and share it through blink, and <br className='hidden md:block' /> let the community power its growth with upvotes, reviews, and tips.</p>
        <Button className='rounded-full mt-3 shadow-inner  font-medium flex items-center gap-[2px]'>Get Started <TrendingUp className='h-5 text-black/70'/></Button>
      </div>
      <div className='mt-14 border bg-stone-900 h-[800px] rounded-lg'>
      </div>
    </main>
  )
}

export default Hero