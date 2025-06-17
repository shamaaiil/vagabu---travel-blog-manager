import React from 'react'

function HeroSection() {
  return (
    <div>
       {/* Hero Section */}
      <section className="py-10 text-center">
        <h2 className="text-6xl font-bold mb-4 text-blue font-dancingScript">See the World Differently</h2>
      </section>
      <div className=''>
        <img src="/public/img/herosection.jpeg" alt="" className='h-[40vh] md:h-[60vh] lg:h-[80vh] w-full'/>
      </div>
    </div>
  )
}

export default HeroSection

