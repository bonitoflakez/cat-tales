"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userData = {
    username: 'Neko Chan',
    xp: 500,
    level: 10,
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4 top-navbar">
      <div className="container mx-auto top-navbar-container">
        <div className="flex justify-between items-center">
          <div className="flex items-center user-profile-small-card" onClick={openModal}>
            <div className="mr-4">
              <img
                src="https://static.wikia.nocookie.net/140d4cba-eb7b-46a6-b102-6870ad6db725/scale-to-width/755"
                alt="Profile"
                className="w-12 h-12 rounded-full user-profile-small-image"
              />
            </div>
            <div>
              <p className="text-white text-lg font-semibold user-profile-small-username">
                {userData.username}
              </p>
              <p className="text-gray-300 text-sm user-profile-small-xp-level">
                XP: {userData.xp} Level: {userData.level}
              </p>
            </div>
          </div>
          <ul className="flex space-x-4 ml-auto top-nav-links">
            <li>
              <Link legacyBehavior href="/">
                <a className="text-white hover:text-gray-400 top-nav-link">Inventory</a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/">
                <a className="text-white hover:text-gray-400 top-nav-link">Daily Rewards</a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/">
                <a className="text-white hover:text-gray-400 top-nav-link">Store</a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/">
                <a className="text-white hover:text-gray-400 top-nav-link">Settings</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 profile-modal-container">
          <div className="bg-white p-4 rounded-lg">
            {/* Modal content */}
            <div className="text-center profile-modal-image">
              <img
                src="https://static.wikia.nocookie.net/140d4cba-eb7b-46a6-b102-6870ad6db725/scale-to-width/755"
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto"
              />
              <p className="text-lg font-semibold profile-modal-username">{userData.username}</p>
              <p className='profile-modal-xp-level'>XP: {userData.xp} Level: {userData.level}</p>
              <button
                onClick={closeModal}
                className="mt-4 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
