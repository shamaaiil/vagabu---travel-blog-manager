import { useGetQuery } from '@/services/apiService'
import Card from '@/ui/Card'
import React from 'react'

function FeaturedProducts() {
  const {data : blogs} = useGetQuery({
    path : '/blogs'
  })
  console.log(blogs)

  return (
    <>
    <h1 className='text-6xl my-8 font-dancingScript text-blue font-semibold text-center'>Featured Blogs</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
      {blogs
        ?.filter((blog) => blog.featured === 'true') // filter featured blogs
        .map((blog) => (
          <Card
            key={blog.id}
            title={blog.title}
            description={blog.excerpt}
            image={blog.image}         
            category={blog.category}
            author={blog.author}
            date={blog.date}
            slug={blog.slug}
          />
        ))}
    </div>
    </>
  )
}

export default FeaturedProducts
