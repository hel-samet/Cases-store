
import React from 'react';
import type { HeroData } from '../types';

interface HeroProps {
    heroData: HeroData;
}

const Hero: React.FC<HeroProps> = ({ heroData }) => {
    return (
        <div className="relative bg-gray-900">
            <div className="absolute inset-0">
                <img className="w-full h-full object-cover" src={heroData.imageUrl} alt="Hero background" />
                <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
            </div>
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                    {heroData.title}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
                    {heroData.subtitle}
                </p>
                <div className="mt-8">
                    <a
                        href="#"
                        className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-md hover:bg-accent-hover transition-transform transform hover:scale-105"
                    >
                        {heroData.ctaText}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hero;