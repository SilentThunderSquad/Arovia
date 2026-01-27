import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatWidget.module.css';
import ChatIcon from './ChatIcon';

/**
 * ChatWidget Component
 * A reusable, expandable chat widget that appears in the bottom-right corner
 * of the page. Features smooth animations, dark/light theme support, and
 * automatic collapse on page navigation.
 * 
 * Usage: <ChatWidget /> - Simply include in your layout or App component
 */
const ChatWidget = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Controls whether the widget is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Current theme (auto-detects from system or HTML class)
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Array of chat messages: { id, sender ('user' | 'bot'), text, timestamp }
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! 👋 How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  
  // Current user input text
  const [inputValue, setInputValue] = useState('');
  
  // Loading state while waiting for bot response
  const [isLoading, setIsLoading] = useState(false);
  
  // ============================================================================
  // REFS
  // ============================================================================
  
  // Reference to the messages container for auto-scrolling to latest message
  const messagesEndRef = useRef(null);
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Initialize theme detection on component mount.
   * Checks for dark theme in system preferences or HTML class
   */
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hasDarkClass = document.documentElement.classList.contains('dark');
    setIsDarkTheme(prefersDark || hasDarkClass);
  }, []);
  
  /**
   * Listen for theme changes and update widget theme accordingly.
   * This allows the widget to respond to theme toggles in the app.
   */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const hasDarkClass = document.documentElement.classList.contains('dark');
      setIsDarkTheme(hasDarkClass);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);
  
  /**
   * Auto-collapse widget when navigating to a different page.
   * Uses PopState event (back/forward navigation) and listens to URL changes
   */
  useEffect(() => {
    const handleNavigation = () => {
      setIsExpanded(false);
    };
    
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);
  
  /**
   * Auto-scroll to the latest message when messages array changes
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  /**
   * Scrolls the messages container to the bottom to show the latest message
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  /**
   * Toggle between expanded and collapsed states
   */
  const handleToggleWidget = () => {
    setIsExpanded(!isExpanded);
  };
  
  /**
   * Handle input change event
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  /**
   * Handle sending a message
   * 1. Validates input is not empty
   * 2. Adds user message to messages array
   * 3. Clears input field
   * 4. Simulates bot response after a delay
   */
  const handleSendMessage = async () => {
    // Validate input
    if (!inputValue.trim()) return;
    
    // Create user message object
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    
    // Add user message to messages array
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input field
    setInputValue('');
    
    // Simulate bot response
    setIsLoading(true);
    await simulateBotResponse(inputValue);
    setIsLoading(false);
  };
  
  /**
   * Simulate a bot response after a delay.
   * In a real app, this would call an API endpoint.
   * 
   * @param {string} userMessage - The message sent by the user
   */
  const simulateBotResponse = async (userMessage) => {
    // Simulate network delay (500-1500ms)
    const delay = Math.random() * 1000 + 500;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "That's a great question! Let me help you with that.",
          'I understand. Can you provide more details?',
          'Thanks for reaching out! How can I assist further?',
          'I appreciate your message. Is there anything else I can help with?',
          'Got it! That sounds interesting. Tell me more.',
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const botMessage = {
          id: messages.length + 2,
          sender: 'bot',
          text: randomResponse,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
        resolve();
      }, delay);
    });
  };
  
  /**
   * Handle Enter key press in input field to send message
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // ============================================================================
  // THEME CLASS
  // ============================================================================
  
  const themeClass = isDarkTheme ? styles.darkTheme : styles.lightTheme;
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className={`${styles.chatWidgetContainer} ${themeClass}`}>
      {/* Collapsed state: Show only the chat icon button */}
      {!isExpanded && (
        <button
          className={styles.chatButton}
          onClick={handleToggleWidget}
          title="Open AI Assistant"
          aria-label="Open AI Assistant"
        >
          <ChatIcon />
          <span className={styles.chatButtonText}>AI Assistant</span>
        </button>
      )}
      
      {/* Expanded state: Show the full chat window */}
      {isExpanded && (
        <div className={styles.chatWindow}>
          {/* Header: Title and close button */}
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderTitle}>
              <ChatIcon />
              <h3>AI Assistant</h3>
            </div>
            <button
              className={styles.closeButton}
              onClick={handleToggleWidget}
              title="Close chat"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          
          {/* Messages container: Displays all chat messages */}
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${styles[`message-${message.sender}`]}`}
              >
                <div className={styles.messageBubble}>
                  <p>{message.text}</p>
                  <span className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Loading indicator while bot is responding */}
            {isLoading && (
              <div className={`${styles.message} ${styles['message-bot']}`}>
                <div className={styles.messageBubble}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Ref for auto-scrolling to latest message */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area: Text input and send button */}
          <div className={styles.inputContainer}>
            <textarea
              className={styles.messageInput}
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              rows="1"
              disabled={isLoading}
              aria-label="Message input"
            />
            <button
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              title="Send message"
              aria-label="Send message"
            >
              {isLoading ? '...' : '→'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
