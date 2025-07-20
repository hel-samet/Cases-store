import React from 'react';

interface FooterProps {
    storeName: string;
}

const Footer: React.FC<FooterProps> = ({ storeName }) => {
    return (
        <footer className="bg-primary text-secondary">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-center md:text-left text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
                    </p>
                    <div className="flex mt-4 md:mt-0 space-x-6 items-center">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;