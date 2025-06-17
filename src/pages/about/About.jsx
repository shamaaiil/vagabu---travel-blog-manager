import Header from "@/ui/Header";
import React from "react";

const About = () => {
  return (
    <div className="w-[95%] mx-auto py-12">
      <Header imageSrc="/public/img/WhatsApp Image 2025-06-04 at 1.04.09 PM.jpeg" title="About"/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-20">
        <div className="flex justify-center">
          <img
            src="/public/img/gallery1.jpeg"
            alt="Hoor Ansari in the mountains of Pakistan"
            className="w-[70%] md:w-full max-w-md rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-4 md:px-0">
          <h1 className="font-dancingScript text-5xl md:text-6xl text-blue mb-4">
            About Me
          </h1>
          <p className="text-gray-700 leading-relaxed text-lg">
            Hi there! I'm Hoor Ansari, a 21-year-old student with a deep love
            for mountains and nature. While I'm still studying, I've had the
            amazing opportunity to explore the breathtaking northern areas of
            Pakistan — from the peaceful valleys to the towering peaks. Places
            like Hunza, Skardu, and Naltar have become my favorite escapes,
            where I find inspiration and adventure. Through this blog, I want to
            share my experiences and the beauty of these mountains, hoping to
            inspire others to explore and appreciate the incredible landscapes
            of Pakistan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-20">
        <div className="flex flex-col justify-center px-4 md:px-0">
          <h1 className="font-dancingScript text-5xl md:text-6xl text-blue mb-4">
            Why This Blog?
          </h1>
          <p className="text-gray-700 leading-relaxed text-lg">
            This blog is my way of sharing the magic of the northern mountains
            of Pakistan — a place close to my heart. As a student and a
            traveler, I want to create a space where others can discover the
            beauty, culture, and adventures that these mountains offer, even if
            they haven't been there yet. It's not just about travel stories;
            it's about inspiring curiosity, encouraging responsible exploration,
            and celebrating the unique experiences that come from connecting
            with nature. Whether you're planning your first trip or just love
            reading about mountain adventures, this blog is here to guide,
            inspire, and share the journey with you.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src="/public/img/me (1).jpeg"
            alt="Hoor Ansari in the mountains of Pakistan"
            className="w-[70%] md:w-full max-w-md rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-20">
        <div className="flex justify-center">
          <img
            src="/public/img/me (2).jpeg"
            alt="Hoor Ansari in the mountains of Pakistan"
            className="w-[70%] md:w-full max-w-md rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-4 md:px-0">
          <h1 className="font-dancingScript text-5xl md:text-6xl text-blue mb-4">
            Let's Connect
          </h1>
          <p className="text-gray-700 leading-relaxed text-lg">
            If you love traveling and want to share your own stories, follow me
            and subscribe to the blog! Feel free to send me your travel
            blogs—I'd be happy to help get them published here. Let's build a
            community of mountain lovers and adventure seekers together!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
