/**
 * ChatWidget Usage Guide
 * ========================
 * 
 * The ChatWidget is a fully reusable, self-contained React component
 * that can be easily integrated into any React application.
 * 
 * INSTALLATION & USAGE
 * ====================
 * 
 * 1. Basic Usage - Add to your main App component:
 * 
 *    import ChatWidget from './components/ChatWidget';
 *    
 *    function App() {
 *      return (
 *        <div className="App">
 *          <Header />
 *          <Main />
 *          <Footer />
 *          
 *          {/* ChatWidget will appear in bottom-right corner */}
 *          <ChatWidget />
 *        </div>
 *      );
 *    }
 * 
 * 2. Or add to your layout component that wraps all pages:
 * 
 *    import ChatWidget from './components/ChatWidget';
 *    
 *    function Layout({ children }) {
 *      return (
 *        <div className="layout">
 *          <Navbar />
 *          {children}
 *          <Footer />
 *          
 *          <ChatWidget />
 *        </div>
 *      );
 *    }
 * 
 * FEATURES
 * ========
 * 
 * ✓ Fully responsive (desktop, tablet, mobile)
 * ✓ Light/Dark theme support
 * ✓ Auto-collapse on page navigation
 * ✓ Smooth expand/collapse animations
 * ✓ Auto-scroll to latest message
 * ✓ Typing indicator while bot responds
 * ✓ Accessible keyboard controls
 * ✓ No external dependencies (except React)
 * ✓ Customizable styling via CSS module
 * ✓ Well-documented code with comments
 * 
 * CUSTOMIZATION
 * =============
 * 
 * 1. Modify Colors:
 *    Edit ChatWidget.module.css and update CSS variables in .chatWidgetContainer:
 *    
 *    --primary-color: #007bff;
 *    --bg-primary: #ffffff;
 *    --text-primary: #212529;
 *    etc.
 * 
 * 2. Change Widget Position:
 *    Edit ChatWidget.module.css .chatWidgetContainer:
 *    
 *    bottom: 20px;  /* Change this value */
 *    right: 20px;   /* Or change this for left positioning */
 * 
 * 3. Modify Initial Button Text:
 *    Edit ChatWidget.jsx, find "AI Assistant" text and change it
 * 
 * 4. Add API Integration:
 *    Replace the simulateBotResponse() function with your actual API call:
 *    
 *    const simulateBotResponse = async (userMessage) => {
 *      const response = await fetch('/api/chat', {
 *        method: 'POST',
 *        body: JSON.stringify({ message: userMessage })
 *      });
 *      const data = await response.json();
 *      
 *      const botMessage = {
 *        id: messages.length + 2,
 *        sender: 'bot',
 *        text: data.reply,
 *        timestamp: new Date()
 *      };
 *      
 *      setMessages(prev => [...prev, botMessage]);
 *    };
 * 
 * KEYBOARD SHORTCUTS
 * ==================
 * 
 * • Enter:              Send message
 * • Shift + Enter:      New line (for multi-line input)
 * • Tab:                Focus send button
 * • Escape:             Close widget (can be added)
 * 
 * THEME DETECTION
 * ===============
 * 
 * The widget automatically detects the app's theme by:
 * 1. Checking system preference (prefers-color-scheme)
 * 2. Looking for 'dark' class on document.documentElement
 * 3. Monitoring changes to the 'dark' class in real-time
 * 
 * If your app uses a different method for theme switching,
 * update the theme detection logic in ChatWidget.jsx useEffect.
 * 
 * FILE STRUCTURE
 * ==============
 * 
 * src/components/ChatWidget/
 * ├── ChatWidget.jsx           (Main component - 300+ lines with comments)
 * ├── ChatWidget.module.css    (Complete styling with responsive design)
 * ├── ChatIcon.jsx             (Icon SVG component)
 * └── index.js                 (Export for easy importing)
 * 
 * BROWSER SUPPORT
 * ===============
 * 
 * • Chrome/Edge:   Full support
 * • Firefox:       Full support
 * • Safari:        Full support (14+)
 * • Mobile:        Full support (iOS Safari, Chrome Mobile, etc.)
 * 
 * ACCESSIBILITY
 * ==============
 * 
 * ✓ ARIA labels on all interactive elements
 * ✓ Keyboard navigation support
 * ✓ Focus indicators for keyboard users
 * ✓ Respects prefers-reduced-motion
 * ✓ Semantic HTML structure
 * ✓ Color contrast ratios (WCAG AA+)
 * 
 * PERFORMANCE
 * ===========
 * 
 * • Only renders when needed (conditional rendering)
 * • Optimized animations with CSS transforms
 * • No external API calls by default (easy to integrate)
 * • Minimal re-renders using efficient React patterns
 * • Automatic memory cleanup (useEffect cleanup)
 * 
 * TROUBLESHOOTING
 * ===============
 * 
 * Q: Widget appears behind other elements
 * A: The z-index is set to 9999. If still behind, check for higher z-index
 *    in other elements or update the value in ChatWidget.module.css
 * 
 * Q: Theme colors not updating
 * A: Ensure you're adding/removing the 'dark' class to document.documentElement
 *    See the MutationObserver effect in ChatWidget.jsx
 * 
 * Q: Messages not scrolling automatically
 * A: Check that messagesEndRef is properly mounted. Look for the div at the
 *    bottom of the messages container in ChatWidget.jsx
 * 
 * Q: Styling conflicts with my app
 * A: CSS modules are scoped by default, but if issues persist:
 *    - Check for global CSS that might override
 *    - Use !important in specific selectors
 *    - Adjust z-index values
 * 
 * API INTEGRATION EXAMPLE
 * =======================
 * 
 * Here's how to connect to a real backend:
 * 
 * const simulateBotResponse = async (userMessage) => {
 *   setIsLoading(true);
 *   try {
 *     const response = await fetch('/api/chat', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify({ message: userMessage }),
 *     });
 * 
 *     if (!response.ok) throw new Error('Failed to get response');
 *     
 *     const data = await response.json();
 * 
 *     const botMessage = {
 *       id: messages.length + 2,
 *       sender: 'bot',
 *       text: data.reply,
 *       timestamp: new Date(),
 *     };
 * 
 *     setMessages((prev) => [...prev, botMessage]);
 *   } catch (error) {
 *     console.error('Chat error:', error);
 *     // Show error message to user
 *     const errorMessage = {
 *       id: messages.length + 2,
 *       sender: 'bot',
 *       text: 'Sorry, I encountered an error. Please try again.',
 *       timestamp: new Date(),
 *     };
 *     setMessages((prev) => [...prev, errorMessage]);
 *   } finally {
 *     setIsLoading(false);
 *   }
 * };
 */

// Export the component
export { default as ChatWidget } from './ChatWidget';
