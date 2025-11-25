
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { ClientPortal } from './pages/ClientPortal';
import { InstructorPortal } from './pages/InstructorPortal';
import { AdminPortal } from './pages/AdminPortal';
import { Booking } from './pages/Booking';
import { User, UserRole } from './types';
import { db } from './services/mockDatabase';

type AppView = 'LANDING' | 'LOGIN' | 'PORTAL' | 'BOOKING';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('LANDING');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('PORTAL');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('LANDING');
  };
  
  const refreshUser = () => {
      if (currentUser) {
          const fresh = db.getUserById(currentUser.id);
          if (fresh) setCurrentUser(fresh);
      }
  };

  const handleStartBooking = () => {
    if (currentUser) {
      setCurrentView('BOOKING');
    } else {
      setCurrentView('LOGIN');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'LANDING':
        return <Landing onStartBooking={handleStartBooking} />;
      
      case 'LOGIN':
        return (
          <Login 
            onLogin={handleLogin} 
            onNavigateToLanding={() => setCurrentView('LANDING')} 
          />
        );

      case 'BOOKING':
        if (!currentUser) return <Login onLogin={handleLogin} onNavigateToLanding={() => setCurrentView('LANDING')} />;
        return (
          <Booking 
            user={currentUser} 
            onComplete={() => {
                refreshUser();
                setCurrentView('PORTAL');
            }} 
            onCancel={() => setCurrentView('PORTAL')} 
          />
        );

      case 'PORTAL':
        if (!currentUser) return <Landing onStartBooking={handleStartBooking} />;
        
        switch (currentUser.role) {
          case UserRole.CLIENT:
            return (
              <ClientPortal 
                user={currentUser} 
                onBookClick={() => setCurrentView('BOOKING')}
              />
            );
          case UserRole.INSTRUCTOR:
            return <InstructorPortal currentUser={currentUser} />;
          case UserRole.ADMIN:
            return <AdminPortal />;
          default:
            return <div>Unknown Role</div>;
        }

      default:
        return <Landing onStartBooking={handleStartBooking} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {currentView !== 'LOGIN' && (
        <Navbar 
          currentUser={currentUser} 
          onLogout={handleLogout}
          onLoginClick={() => setCurrentView('LOGIN')}
          onHomeClick={() => setCurrentView(currentUser ? 'PORTAL' : 'LANDING')}
        />
      )}
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
