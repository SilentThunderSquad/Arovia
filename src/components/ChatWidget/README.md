# ChatWidget - Quick Integration Guide

## 🚀 Quick Start (30 seconds)

### Step 1: Import the component
```jsx
import ChatWidget from './components/ChatWidget';
```

### Step 2: Add to your App
```jsx
function App() {
  return (
    <div className="App">
      {/* Your app content */}
      <ChatWidget />
    </div>
  );
}
```

That's it! The widget will appear in the bottom-right corner of your page.

---

## 📁 File Structure

```
src/components/ChatWidget/
├── ChatWidget.jsx           # Main component (300+ lines, fully commented)
├── ChatWidget.module.css    # Complete styling with responsive design
├── ChatIcon.jsx             # Chat icon SVG component
├── index.js                 # Easy export
├── USAGE.md                 # Detailed usage guide
└── EXAMPLE.jsx              # Integration examples
```

---

## ✨ Key Features

- ✅ **Fully Responsive**: Works on desktop, tablet, and mobile
- ✅ **Theme Support**: Auto-detects light/dark mode with real-time updates
- ✅ **Auto-Collapse**: Minimizes when navigating to a new page
- ✅ **Smooth Animations**: Professional expand/collapse transitions
- ✅ **Message History**: Maintains conversation history
- ✅ **Typing Indicator**: Shows loading state while bot responds
- ✅ **Accessible**: Full keyboard navigation and ARIA labels
- ✅ **Customizable**: Easy CSS variable customization
- ✅ **No Dependencies**: Only requires React (no extra libraries)

---

## 🎨 Customization

### Change Colors
Edit `ChatWidget.module.css` and update the CSS variables:
```css
.chatWidgetContainer {
  --primary-color: #007bff;        /* Main color */
  --bg-primary: #ffffff;           /* Background */
  --text-primary: #212529;         /* Text color */
  --message-user-bg: #007bff;      /* User message background */
}
```

### Change Position
Move the widget to the bottom-left instead:
```css
.chatWidgetContainer {
  bottom: 20px;
  left: 20px;    /* Change from right to left */
  right: auto;
}
```

### Change Size
Adjust the chat window dimensions:
```css
.chatWindow {
  width: 400px;    /* Default: 380px */
  height: 700px;   /* Default: 600px */
}
```

---

## 🔗 API Integration

Replace the placeholder bot response with a real API call:

```jsx
const simulateBotResponse = async (userMessage) => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });
    
    const data = await response.json();
    
    const botMessage = {
      id: messages.length + 2,
      sender: 'bot',
      text: data.reply,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    console.error('Chat error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Enter** | Send message |
| **Shift + Enter** | New line in input |
| **Tab** | Focus send button |
| **Click close (✕)** | Collapse widget |

---

## 🌙 Theme Detection

The widget automatically detects your app's theme by:
1. Checking system preference (`prefers-color-scheme`)
2. Looking for `dark` class on `document.documentElement`
3. Monitoring for real-time theme changes

**If your app uses a different theme system:**
Edit the `useEffect` in `ChatWidget.jsx` that has `MutationObserver` to match your theme implementation.

---

## 📱 Responsive Behavior

| Screen Size | Behavior |
|-------------|----------|
| **Desktop** (> 640px) | 380px × 600px window, text visible on button |
| **Tablet** (640px - 480px) | Full-width window with padding |
| **Mobile** (< 480px) | Full-screen, icon-only button, takes entire screen when expanded |

---

## 🔍 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari 14+
- ✅ iOS Safari
- ✅ Android Chrome

---

## ♿ Accessibility

- ✅ ARIA labels on all buttons
- ✅ Keyboard navigation support
- ✅ Focus indicators for keyboard users
- ✅ Respects `prefers-reduced-motion`
- ✅ Proper semantic HTML
- ✅ WCAG AA color contrast

---

## 🐛 Troubleshooting

### Widget appears behind other elements
**Solution**: Check your app's z-index values. The widget uses `z-index: 9999`. Update if needed in `ChatWidget.module.css`.

### Theme colors not updating
**Solution**: Ensure your app adds/removes the `dark` class to `document.documentElement`. The widget watches for changes automatically.

### Messages don't scroll automatically
**Solution**: This is handled automatically by the `messagesEndRef`. Check browser console for errors.

### CSS conflicts with global styles
**Solution**: CSS modules are scoped by default. If issues persist:
- Check for conflicting global CSS
- Increase specificity with more selectors
- Use `!important` as a last resort

---

## 📝 Code Comments

Every function and significant section has detailed comments explaining:
- What it does
- Why it's implemented that way
- How to modify it
- Any edge cases to consider

Read through the main `ChatWidget.jsx` file for deep understanding of the implementation.

---

## 🎯 Next Steps

1. **Copy** the `ChatWidget` folder to your `src/components/` directory
2. **Import** it in your main App component
3. **Add** `<ChatWidget />` to your JSX
4. **Customize** colors and styling as needed
5. **Integrate** with your backend API when ready

---

## 📚 Additional Resources

- See [USAGE.md](./USAGE.md) for detailed usage patterns
- See [EXAMPLE.jsx](./EXAMPLE.jsx) for integration examples
- Review comments in `ChatWidget.jsx` for implementation details
- Check `ChatWidget.module.css` for all available CSS customizations

---

**Enjoy your new chat widget! 🎉**
