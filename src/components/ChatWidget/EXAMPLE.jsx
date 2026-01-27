/**
 * EXAMPLE: How to use the ChatWidget component
 * 
 * This is an example showing how to integrate the ChatWidget
 * into your React application. Simply import and add it to any component.
 */

import React from 'react';
import ChatWidget from './ChatWidget';
// import ChatWidget from '@/components/ChatWidget'; // Alternative import path

/**
 * Example 1: Simple usage in App component
 */
export function AppWithChatWidget() {
  return (
    <div className="app">
      <header>
        <h1>My Website</h1>
      </header>

      <main>
        <p>Your page content here...</p>
      </main>

      <footer>
        <p>&copy; 2024 My Company</p>
      </footer>

      {/* ChatWidget appears in bottom-right corner, persists across page navigation */}
      <ChatWidget />
    </div>
  );
}

/**
 * Example 2: Usage in a Layout component (for multi-page apps)
 */
export function Layout({ children }) {
  return (
    <div className="layout">
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>

      <main>{children}</main>

      <footer>
        <p>&copy; 2024 My Company</p>
      </footer>

      {/* ChatWidget will persist and auto-collapse on navigation */}
      <ChatWidget />
    </div>
  );
}

/**
 * Example 3: Usage with React Router
 * 
 * In your main App.jsx:
 * 
 * import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 * import ChatWidget from './components/ChatWidget';
 * import Home from './pages/Home';
 * import About from './pages/About';
 * 
/**
 * INTEGRATION EXAMPLE
 * 
 * How to add ChatWidget to your React Router application:
 * 
 * import React from 'react';
 * import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 * import ChatWidget from './components/ChatWidget';
 * 
 * function App() {
 *   return (
 *     <Router>
 *       <Routes>
 *         <Route path="/" element={<Home />} />
 *         <Route path="/about" element={<About />} />
 *       </Routes>
 *       
 *       ChatWidget will be available on all pages
 *       <ChatWidget />
 *     </Router>
 *   );
 * }
 */

export default AppWithChatWidget;
