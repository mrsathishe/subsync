import React from 'react';
import { 
  FaInstagram, 
  FaLinkedin, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe, 
  FaHeart,
  FaReact,
  FaNodeJs,
  FaDatabase 
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Developer Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Developer</h3>
            <p className="text-gray-300 mb-2">
              <span className="font-medium text-white">Sathish</span>
            </p>
            <p className="text-gray-400 text-sm">
              Full Stack Developer & Software Engineer
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Contact</h3>
            <div className="space-y-2">
              <p className="text-gray-300 flex items-center gap-2">
                <FaPhone className="text-blue-400" />
                <a 
                  href="tel:+919790060943" 
                  className="hover:text-blue-400 transition-colors"
                >
                  +91 - 97900 60943
                </a>
              </p>
              <p className="text-gray-300 flex items-center gap-2">
                <FaEnvelope className="text-blue-400" />
                <a 
                  href="mailto:mrsathishe@gmail.com" 
                  className="hover:text-blue-400 transition-colors"
                >
                  mrsathishe@gmail.com
                </a>
              </p>
              <p className="text-gray-300 flex items-center gap-2">
                <FaGlobe className="text-blue-400" />
                <a 
                  href="https://satz.co.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  satz.co.in
                </a>
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Connect</h3>
            <div className="space-y-2">
              <p className="text-gray-300 flex items-center gap-2">
                <FaInstagram className="text-pink-400" />
                <a 
                  href="https://www.instagram.com/sathish_e_09" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-colors"
                >
                  @sathish_e_09
                </a>
              </p>
              <p className="text-gray-300 flex items-center gap-2">
                <FaLinkedin className="text-blue-500" />
                <a 
                  href="https://www.linkedin.com/in/sathish-e" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  LinkedIn Profile
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              © {new Date().getFullYear()} SubSync. Built with <FaHeart className="text-red-500" /> by Sathish.
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <FaReact className="text-cyan-400" /> React
              </span>
              <span className="flex items-center gap-1">
                <FaNodeJs className="text-green-400" /> Node.js
              </span>
              <span className="flex items-center gap-1">
                <FaDatabase className="text-blue-400" /> PostgreSQL
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;