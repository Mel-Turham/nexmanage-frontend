import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import IndicatorsCarousel from './indicators-carousel';

interface CarouselItem {
  imageUrl: string;
  topImages: {
    image1: string;
    image2: string;
  };
  centerImages: {
    image1: string;
    image2: string;
  };
  testimonial: {
    text: string;
    author: string;
  };
}

const AuthRight = ({ className }: { className?: string }) => {
  // Données du carrousel
  const carouselData: CarouselItem[] = [
    {
      imageUrl: '/auth-login-image.webp', // Remplacez par vos vraies images
      topImages: {
        image1: '/task-hour-1.jpg',
        image2: '/task-hour-3.png',
      },
      centerImages: {
        image1: '/task-hour-2.png',
        image2: '/task-hour-4.png',
      },
      testimonial: {
        text: 'Depuis que nous utilisons NexManage, la gestion des tâches et des présences de nos équipes est devenue beaucoup plus simple et efficace.',
        author: 'Marie Dupont, Responsable RH chez Innovatech',
      },
    },
    {
      imageUrl: '/auth-register-image.webp',
      topImages: {
        image1: '/task-hour-1.jpg',
        image2: '/task-hour-3.png',
      },
      centerImages: {
        image1: '/task-hour-2.png',
        image2: '/task-hour-4.png',
      },
      testimonial: {
        text: "L'interface intuitive de NexManage a révolutionné notre façon de travailler. Nos employés adorent sa simplicité.",
        author: 'Jean Martin, Directeur Opérationnel chez TechCorp',
      },
    },
    {
      imageUrl: '/auth-login-image.webp',
      topImages: {
        image1: '/task-hour-1.jpg',
        image2: '/task-hour-3.png',
      },
      centerImages: {
        image1: '/task-hour-2.png',
        image2: '/task-hour-4.png',
      },
      testimonial: {
        text: 'Grâce à NexManage, nous avons réduit de 40% le temps consacré à la gestion administrative. Un vrai gain de productivité !',
        author: 'Sophie Leroy, Manager chez DataFlow',
      },
    },
    {
      imageUrl: '/auth-register-image.webp',
      topImages: {
        image1: '/task-hour-1.jpg',
        image2: '/task-hour-3.png',
      },
      centerImages: {
        image1: '/task-hour-2.png',
        image2: '/task-hour-4.png',
      },
      testimonial: {
        text: "NexManage nous a permis d'optimiser notre gestion des ressources humaines avec une précision remarquable.",
        author: 'Paul Dubois, CEO chez StartupPro',
      },
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Navigation vers un slide spécifique
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false); // Arrête l'auto-play temporairement

    // Reprend l'auto-play après 5 secondes
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 5000);
  };

  // Auto-play du carrousel
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change toutes les 4 secondes

    return () => clearInterval(interval);
  }, [isAutoPlay, carouselData.length]);

  // const currentItem = carouselData[currentIndex];

  return (
    <div
      className={cn(
        'hidden overflow-hidden h-screen lg:block w-1/2 relative',
        className
      )}
    >
      {/* Image de fond avec transition */}
      <div className='relative w-full h-full'>
        {carouselData.map((item, index) => (
          <Image
            key={index}
            src={item.imageUrl}
            fill
            alt={`Slide ${index + 1}`}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-1000 ease-in-out',
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            )}
          />
        ))}
      </div>

      {/* Images du haut avec transition */}
      <div className='absolute top-0 left-0 h-[70px] w-full'>
        <div className='relative w-full h-full'>
          {carouselData.map((item, index) => (
            <div
              key={`top-${index}`}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Image
                src={item.topImages.image1}
                width={200}
                height={100}
                alt=''
                className='absolute top-1/2 left-8 z-10 transform -translate-y-1/2'
              />
              <Image
                src={item.topImages.image2}
                width={200}
                height={100}
                alt=''
                className='absolute top-[80px] left-14'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Images du centre avec transition */}
      <div className='absolute top-[45%] w-full'>
        <div className='relative w-full h-full'>
          {carouselData.map((item, index) => (
            <div
              key={`center-${index}`}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Image
                src={item.centerImages.image1}
                width={200}
                height={100}
                alt=''
                className='absolute top-1/2 left-40 z-10 transform -translate-y-1/2'
              />
              <Image
                src={item.centerImages.image2}
                width={200}
                height={100}
                alt=''
                className='absolute -top-[30px] left-28'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section du bas avec témoignages et indicateurs */}
      <div className='absolute bottom-0 left-0 space-y-2 py-3 w-full px-8 bg-gradient-to-b from-black/50 to-black/0 backdrop-blur-sm'>
        {/* Indicateurs */}
        <div className='flex gap-2 items-center'>
          {carouselData.map((_, index) => (
            <IndicatorsCarousel
              key={index}
              isActif={index === currentIndex}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* Témoignages avec transition */}
        <div className='text-white mt-4 relative min-h-[100px]'>
          {carouselData.map((item, index) => (
            <div
              key={`testimonial-${index}`}
              className={cn(
                'absolute inset-0 transition-opacity duration-700 ease-in-out',
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              )}
            >
              <p className='text-sm tracking-wide'>{item.testimonial.text}</p>
              <p className='text-sm tracking-wide font-semibold mt-3'>
                {item.testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateur de pause (optionnel) */}
      {!isAutoPlay && (
        <div className='absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs'>
          Auto-play pausé
        </div>
      )}
    </div>
  );
};

export default AuthRight;
