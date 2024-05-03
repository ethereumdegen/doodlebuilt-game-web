import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react";


import image1 from '@/assets/images/punk1164.png';
import image2 from '@/assets/images/punk1164.png';
import image3 from '@/assets/images/punk1164.png';


function ImageGallery() {
  const images = [
    image1,
    image2,
    image3,
    // Add more image URLs as needed
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden  object-cover object-center"  style={{maxHeight: "600px" }}>
      <img src={images[currentImageIndex]} alt="Gallery" className="w-full h-auto object-center" />
    </div>
  );
}

function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <main className="flex-grow">
        <div className="container mx-auto px-4 pb-12">
          <section className="pt-16 pb-8">
            <h1 className="text-4xl font-bold mb-4"> Doodlebuilt </h1>
            <p className="text-lg mb-8">Indie games that speak to your Spirit.</p>
            <ImageGallery
             
            />
          </section>

          <section className="py-16 hidden">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="mb-4">
              We are a passionate team of indie game developers dedicated to crafting unique and engaging gaming experiences.
            </p>
            <p>
              Our mission is to push the boundaries of creativity and deliver games that captivate players from all around the world.
            </p>
          </section>

          <section className="py-16">
            <h2 className="text-3xl font-bold mb-4">Our Blog Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Add your featured games here */}
              <div>
                <img src="game1.jpg" alt="Game 1" className="w-full h-auto mb-4" />
                <h3 className="text-xl font-bold">Game 1</h3>
                <p>Description of Game 1</p>
              </div>
              <div>
                <img src="game2.jpg" alt="Game 2" className="w-full h-auto mb-4" />
                <h3 className="text-xl font-bold">Game 2</h3>
                <p>Description of Game 2</p>
              </div>
              <div>
                <img src="game3.jpg" alt="Game 3" className="w-full h-auto mb-4" />
                <h3 className="text-xl font-bold">Game 3</h3>
                <p>Description of Game 3</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default observer(Home);