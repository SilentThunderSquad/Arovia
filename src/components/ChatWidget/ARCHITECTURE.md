# ChatWidget Component - Visual Architecture

## 📐 Component Structure

```
ChatWidget (Main Component)
│
├── State Management
│   ├── isExpanded (boolean)
│   ├── isDarkTheme (boolean)
│   ├── messages (array)
│   ├── inputValue (string)
│   └── isLoading (boolean)
│
├── Effects (useEffect)
│   ├── Theme detection (on mount)
│   ├── Theme monitoring (MutationObserver)
│   ├── Navigation detection (popstate)
│   └── Auto-scroll (when messages change)
│
├── Functions
│   ├── handleToggleWidget() → toggle expand/collapse
│   ├── handleSendMessage() → add user message & trigger bot response
│   ├── handleInputChange() → update input field
│   ├── simulateBotResponse() → simulated bot reply (API-ready)
│   ├── handleKeyPress() → Enter key to send
│   └── scrollToBottom() → auto-scroll to latest
│
└── JSX Rendering
    ├── Collapsed State
    │   └── Chat Button
    │       ├── ChatIcon
    │       └── Text Label
    │
    └── Expanded State
        └── Chat Window
            ├── Header
            │   ├── ChatIcon
            │   ├── Title
            │   └── Close Button
            ├── Messages Container
            │   ├── Message (user)
            │   ├── Message (bot)
            │   └── Typing Indicator
            └── Input Area
                ├── Textarea
                └── Send Button
```

---

## 🎨 Visual Layout

### Collapsed State (Desktop)
```
┌─────────────────────────────────────────────┐
│                                             │
│  Your App Content                           │
│                                             │
│                              ┌──────────────┤
│                              │  💬 AI Asst. │
│                              └──────────────┘
```

### Expanded State (Desktop)
```
┌─────────────────────────────────────────────┐
│                                             │
│  Your App Content                           │
│                              ┌──────────────┐
│                              │  AI Asst. ✕  │
│                              ├──────────────┤
│                              │  Hello! 👋   │
│                              │  How can I   │
│                              │  help?       │
│                              │              │
│                              │  > Your msg  │
│                              ├──────────────┤
│                              │ [Type msg]   │
│                              │       [→]    │
│                              └──────────────┘
```

### Mobile State
```
┌──────────────────────────┐
│ App Header               │
├──────────────────────────┤
│                          │
│ Content                  │
│                          │
├──────────────────────────┤
│ 💬 AI Asst. (button)     │
└──────────────────────────┘

// When expanded (full screen)
┌──────────────────────────┐
│ AI Assistant ✕           │
├──────────────────────────┤
│ Hello! 👋                │
│ How can I help?          │
│                          │
│ > Your message here      │
├──────────────────────────┤
│ [Type message...       ] │
│ [→]                      │
└──────────────────────────┘
```

---

## 🔄 Data Flow

```
User Types Message
       │
       ▼
handleInputChange()
       │
       ▼
inputValue state updated
       │
       ▼
User Presses Enter or Clicks Send
       │
       ▼
handleSendMessage()
       │
       ├─► Validate input (not empty)
       │
       ├─► Create user message object
       │
       ├─► Add to messages array
       │
       ├─► Clear input field
       │
       └─► simulateBotResponse()
            │
            ├─► Set isLoading = true
            │
            ├─► Wait delay (500-1500ms)
            │
            ├─► Create bot message
            │
            ├─► Add to messages array
            │
            └─► Set isLoading = false
                │
                ▼
           Messages re-render
           Auto-scroll to bottom
```

---

## 🎯 State Machine

```
┌─────────────────────────────────────────┐
│         ChatWidget States               │
├─────────────────────────────────────────┤
│                                         │
│  INITIAL STATE:                         │
│  isExpanded = false                     │
│  isDarkTheme = auto-detected            │
│  messages = [greeting]                  │
│  inputValue = ""                        │
│  isLoading = false                      │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  TRANSITIONS:                           │
│                                         │
│  Collapsed ──(click button)──> Expanded │
│                                    │    │
│         ◄──(click ✕)─────────────┘    │
│                                        │
│  isLoading ──(send msg)──> true       │
│              (wait 500ms)              │
│              (add bot msg)             │
│              (check isLoading)──> false│
│                                        │
│  isDarkTheme ──(theme change)──> toggle│
│                (watch class)           │
│                                        │
└─────────────────────────────────────────┘
```

---

## 📊 Message Object Structure

```
Message {
  id: number                    // Unique message ID
  sender: 'user' | 'bot'        // Who sent it
  text: string                  // Message content
  timestamp: Date               // When it was sent
}

Example:
{
  id: 5,
  sender: 'user',
  text: 'Hello there!',
  timestamp: 2024-01-23T10:30:00.000Z
}
```

---

## 🎨 Theme Colors Structure

```
Light Theme:
├── Primary: #007bff (blue)
├── Background: #ffffff (white)
├── Text: #212529 (dark gray)
├── Secondary BG: #f8f9fa (light gray)
├── Border: #e9ecef (light border)
├── User Message BG: #007bff (blue)
└── Bot Message BG: #e9ecef (light gray)

Dark Theme:
├── Primary: #007bff (blue - same)
├── Background: #1e1e1e (dark)
├── Text: #ffffff (white)
├── Secondary BG: #2d2d2d (dark gray)
├── Border: #3d3d3d (dark border)
├── User Message BG: #0d47a1 (darker blue)
└── Bot Message BG: #424242 (dark gray)
```

---

## 🔌 Component Lifecycle

```
Mount:
  1. Initialize state
  2. Detect theme
  3. Setup MutationObserver
  4. Setup popstate listener
  5. Setup messagesEndRef

Render Loop:
  1. Check isExpanded
  2. Render collapsed OR expanded
  3. Apply theme class
  4. Update messages
  5. Handle input

Unmount:
  1. Cleanup MutationObserver
  2. Remove popstate listener
  3. Clear timeouts/intervals
```

---

## 📱 Responsive Breakpoints

```
Desktop (> 640px)
├── Window: 380px × 600px
├── Padding: 16px
├── Button: Shows text
└── Layout: Fixed position

Tablet (640px - 480px)
├── Window: calc(100vw - 40px) × calc(100vh - 120px)
├── Padding: 12px
├── Button: Shows text
└── Layout: Mostly full-width

Mobile (< 480px)
├── Window: 100vw × 100vh (full screen)
├── Padding: 10px
├── Button: Icon only
└── Layout: Full takeover
```

---

## 🎬 Animation Timeline

```
Click Expand Button:
  t=0ms: Animation start
         opacity: 0 → 1
         transform: translateY(20px) → scale(1)
  t=300ms: Animation complete
           chatWindow appears

Click Message Appears:
  t=0ms: opacity: 0, translateY(10px)
  t=300ms: opacity: 1, translateY(0)

Close Button Hover:
  t=0ms: Opacity 0.8
  t=200ms: opacity 1, scale(1.1)

Typing Indicator:
  Loop animation:
    t=0ms: First dot down
    t=200ms: Second dot down
    t=400ms: Third dot down
    t=1400ms: Reset
```

---

## 🔐 Security & Performance

```
Security:
├── No direct eval() calls
├── No innerHTML usage
├── User input escaped via React
├── No external script loading
└── Local state management

Performance:
├── Conditional rendering
├── Memoized functions
├── CSS transforms (GPU)
├── Lazy message loading
├── Minimal re-renders
├── Event delegation
└── Cleanup on unmount
```

---

## 🌳 File Dependencies

```
ChatWidget (main export)
├── imports: React, styles, ChatIcon
├── exports: ChatWidget component
│
ChatWidget.module.css
├── Light theme variables
├── Dark theme variables
├── 15+ responsive selectors
├── Animation keyframes
└── Accessibility rules

ChatIcon.jsx
├── Simple SVG component
├── Used in: ChatWidget header + button
└── No dependencies

index.js
├── Re-exports ChatWidget
├── Enables: import ChatWidget from './ChatWidget'
└── Standard export pattern
```

---

## 🧪 Testing Points

```
Unit Tests:
  ├── Message sending
  ├── Input validation
  ├── State updates
  ├── Theme detection
  └── Animation triggers

Integration Tests:
  ├── Widget expand/collapse
  ├── Message display
  ├── Auto-scroll
  ├── Theme switching
  └── Navigation detection

E2E Tests:
  ├── Full chat flow
  ├── Mobile responsiveness
  ├── Keyboard navigation
  ├── Dark mode toggle
  └── Cross-browser compatibility
```

---

## 📋 Component Props (None!)

```
ChatWidget doesn't accept props.
It's self-contained!

All configuration via:
├── CSS variables (colors, size, position)
├── Direct code editing (initial messages)
├── Theme detection (automatic)
└── State management (internal)

This makes it:
✓ Simple to use
✓ Easy to import
✓ No configuration needed
✓ Just plug and play!
```

---

## 🎯 Feature Map

```
Requirement → Implementation → File Location

Bottom-right corner     → CSS positioning → ChatWidget.module.css
Icon + text button      → JSX + SVG       → ChatWidget.jsx, ChatIcon.jsx
Expandable window       → useState toggle → ChatWidget.jsx
Scrollable messages     → overflow-y auto → ChatWidget.module.css
User input + send       → textarea+button → ChatWidget.jsx
Auto-collapse on nav    → popstate event  → ChatWidget.jsx
Smooth animations       → CSS transitions → ChatWidget.module.css
Light/dark theme        → CSS variables   → ChatWidget.module.css
Responsive design       → Media queries   → ChatWidget.module.css
Placeholder functions   → Handler funcs   → ChatWidget.jsx
Reusable component      → Self-contained  → All files
CSS modules             → .module.css     → ChatWidget.module.css
Comments explaining     → JSDoc blocks    → All .jsx files
```

---

## 🚀 Deployment Checklist

```
Before deploying:
  ☐ Test in all browsers
  ☐ Test on mobile devices
  ☐ Test dark mode toggle
  ☐ Test keyboard navigation
  ☐ Verify API endpoint (when integrated)
  ☐ Check console for errors
  ☐ Test auto-collapse on navigation
  ☐ Verify responsive design
  ☐ Check performance metrics
  ☐ Audit accessibility
  ☐ Test with screen reader

Optimization:
  ☐ CSS is minified (Vite handles this)
  ☐ Code splitting if needed
  ☐ Lazy load if using heavy libs
  ☐ Optimize message history limit
  ☐ Cache API responses

Monitoring:
  ☐ Track widget usage
  ☐ Monitor error rates
  ☐ Log API failures
  ☐ Watch performance metrics
```

---

This complete visual architecture should help you understand how every piece fits together! 🎉
