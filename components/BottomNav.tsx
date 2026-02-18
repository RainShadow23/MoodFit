import React from 'react';
import { UserProfile } from '../types';
import { t } from '../i18n';

interface Props {
  activeTab: 'home' | 'style' | 'diet';
  onTabChange: (tab: 'home' | 'style' | 'diet') => void;
  onOpenProfile: () => void;
  user: UserProfile;
}

const BottomNav: React.FC<Props> = ({ activeTab, onTabChange, onOpenProfile, user }) => {
  const navItems = [
    { id: 'home', icon: 'grid_view', label: t(user.language, 'nav_home') },
    { id: 'style', icon: 'checkroom', label: t(user.language, 'nav_wardrobe') },
    // Center FAB placeholder
    { id: 'fab', icon: 'add', label: '' }, 
    { id: 'diet', icon: 'restaurant_menu', label: t(user.language, 'nav_meals') },
    { id: 'profile', icon: 'person', label: t(user.language, 'nav_profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5 px-6 pb-6 pt-2 flex justify-between items-end text-gray-400 dark:text-gray-500 z-50">
      {navItems.map((item) => {
        if (item.id === 'fab') {
            return (
                <div key={item.id} className="relative -top-6">
                    <button 
                      onClick={() => onTabChange('home')} // FAB acts as "Home/Dashboard" button for now
                      className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 transform active:scale-95 transition-transform hover:scale-105 duration-200"
                    >
                    <span className="material-icons-round text-2xl">add</span>
                    </button>
                </div>
            )
        }
        
        const isActive = activeTab === item.id;
        
        // Handle click logic based on item type
        const handleClick = () => {
            if (item.id === 'profile') {
                onOpenProfile();
            } else {
                onTabChange(item.id as 'home' | 'style' | 'diet');
            }
        };

        return (
          <button 
            key={item.id}
            onClick={handleClick}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`}
          >
            <span className="material-icons-round">{item.icon}</span>
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;