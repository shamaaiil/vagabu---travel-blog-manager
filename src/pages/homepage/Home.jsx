// src/pages/Home.jsx
import FeaturedProducts from "@/components/FeaturedBlogs";
import FearuredDestinations from "@/components/FeaturedDestinations";
import Destinations from "@/components/FeaturedDestinations";
import HeroSection from "@/components/HeroSection";
import PhotoGallery from "@/components/PhotoGallery";
import { useGetBlogsQuery } from "@/hooks/useGetBlogsQuery";

export default function Home() {
  const { data: blogs } = useGetBlogsQuery();
  console.log(blogs);

  return (
    <div className="min-h-screen bg-gray-50 w-[95%] mx-auto">
      <HeroSection />
      <FeaturedProducts />
      <FearuredDestinations />
      <PhotoGallery />
      {/* <DetailPage/> */}
    </div>
  );
}
