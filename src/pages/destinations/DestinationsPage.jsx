import { useGetQuery } from '@/services/apiService'
import Header from '@/ui/Header'
import React from 'react'
import { FaBlog, FaCalendarAlt, FaMapMarkerAlt, FaTags } from 'react-icons/fa'

function DestinationsPage() {
 
    const {data : destinations } = useGetQuery({
        path : '/destinations'
    })

    console.log(destinations)

  return (
    <>
    
     <Header title="Destinations"/>

     <h1  className="text-3xl text-center text-blue mt-10 font-semibold">
        Explore Stunning Destinations
      </h1>
     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 my-10'>
       
        {destinations?.map((dest) => (
           <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
                    {/* Image */}
                    <div className="relative h-64">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-grey">
                        {dest.name}
                      </h3>
                    </div>
                    {/* Content */}
                    <div className="p-6 text-blue">
                      <div className="flex items-center mb-3">
                        <FaMapMarkerAlt className="text-blue-600 mr-2" />
                        <span >{dest.region}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <FaTags className="text-blue-600 mr-2" />
                        <span >{dest.type.join(", ")}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <FaCalendarAlt className="text-blue-600 mr-2" />
                        <span >Best Season: {dest.bestSeason}</span>
                      </div>
                      <div className="flex items-center">
                        <FaBlog className="text-blue-600 mr-2" />
                        <span >{dest.blogCount} Blogs</span>
                      </div>
                      <button className="mt-4 w-full bg-blue text-pastelgrey py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                      onClick={() => handleDiscoverMore(dest.slug)}
                      >
                        Discover More
                      </button>
                    </div>
                  </div>
        ))}
      
    </div>
    </>
  )
}

export default DestinationsPage
