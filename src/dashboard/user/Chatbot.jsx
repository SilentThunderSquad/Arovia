import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Fab, Paper, Typography, IconButton, TextField, Button, CircularProgress } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_BOT_MESSAGE = 'नमस्ते 👋 मैं Arovia Health Care असिस्टेंट हूँ। कृपया बताएं आपको क्या समस्या है? (Hello, I am Arovia Health Care Assistant. Tell me your problem.)';

const PROBLEM_TYPES = [
  { label: 'दर्द / Pain', value: 'pain' },
  { label: 'बुखार / Fever', value: 'fever' },
  { label: 'त्वचा की समस्या / Skin Issue', value: 'skin' },
  { label: 'सांस की समस्या / Breathing', value: 'breathing' },
  { label: 'अन्य / Other', value: 'other' },
];

const PAIN_LOCATIONS = [
  { label: 'छाती / Chest', value: 'chest_pain' },
  { label: 'सिर / Head', value: 'head_pain' },
  { label: 'पेट /Stomach', value: 'stomach_pain' },
  { label: 'मांसपेशी / Muscles', value: 'muscle_pain' },
  { label: 'जोड़ / Joints', value: 'joint_pain' },
];

const PROBLEM_FOLLOW_UPS = {
  pain: [
    { key: 'pain_location', question: 'किस जगह दर्द है? (Where is the pain?)' },
    { key: 'pain_duration', question: 'कब से दर्द है? (Since when do you have this pain?)' },
    { key: 'pain_frequency', question: 'क्या दर्द लगातार है या कभी कभी? (Is it constant or intermittent?)' },
    { key: 'fever', question: 'क्या आपको बुखार है? (Do you have fever?)' },
    { key: 'headache', question: 'क्या सिर दर्द है? (Do you have headache?)' },
    { key: 'nausea', question: 'क्या मतली या उल्टी है? (Do you have nausea or vomiting?)' },
    { key: 'fatigue', question: 'क्या थकान महसूस हो रही है? (Do you feel fatigued?)' },
    { key: 'cough', question: 'क्या खांसी है? (Do you have cough?)' },
  ],
  fever: [
    { key: 'fever_duration', question: 'कब से बुखार है? (Since when do you have fever?)' },
    { key: 'fever_temperature', question: 'बुखार कितना है? (How high is the fever - High/Moderate/Mild?)' },
    { key: 'cough', question: 'क्या खांसी है? (Do you have cough?)' },
    { key: 'body_pain', question: 'शरीर में दर्द है? (Do you have body pain?)' },
    { key: 'headache', question: 'क्या सिर दर्द है? (Do you have headache?)' },
    { key: 'chills', question: 'क्या ठंड लग रही है? (Do you have chills?)' },
    { key: 'sweating', question: 'क्या पसीना आ रहा है? (Do you have sweating?)' },
    { key: 'fatigue', question: 'क्या थकान है? (Do you feel fatigued?)' },
  ],
  skin: [
    { key: 'skin_location', question: 'त्वचा की समस्या कहाँ है? (Where is the skin problem?)' },
    { key: 'skin_duration', question: 'कब से है? (Since when?)' },
    { key: 'itching', question: 'क्या खुजली हो रही है? (Is it itching?)' },
    { key: 'swelling', question: 'सूजन तो नहीं है? (Is there swelling?)' },
    { key: 'skin_swelling', question: 'क्या त्वचा में सूजन है? (Is there skin swelling?)' },
    { key: 'rash', question: 'क्या रैश है? (Do you have rash?)' },
    { key: 'redness', question: 'क्या लालिमा है? (Is there redness?)' },
    { key: 'pain', question: 'क्या दर्द है? (Is there pain?)' },
  ],
  breathing: [
    { key: 'breathing_duration', question: 'कब से सांस लेने में दिक्कत है? (Since when do you have breathing problems?)' },
    { key: 'breathing_frequency', question: 'कब कब होती है यह दिक्कत? (When does it happen?)' },
    { key: 'cough', question: 'क्या खांसी भी आ रही है? (Do you have cough?)' },
    { key: 'chest_pain', question: 'सीने में दर्द तो नहीं? (Do you have chest pain?)' },
    { key: 'shortness_of_breath', question: 'क्या सांस फूल रही है? (Do you have shortness of breath?)' },
    { key: 'rapid_breathing', question: 'क्या सांस तेजी से चल रही है? (Do you have rapid breathing?)' },
    { key: 'chest_tightness', question: 'क्या सीने में जकड़न है? (Do you have chest tightness?)' },
    { key: 'wheezing', question: 'क्या सीटी की आवाज आ रही है? (Do you have wheezing?)' },
  ],
  other: [
    { key: 'symptom_description', question: 'आपको क्या समस्या है? (What problem are you facing?)' },
    { key: 'duration', question: 'कब से है? (Since when?)' },
    { key: 'fever', question: 'क्या बुखार है? (Do you have fever?)' },
    { key: 'severity', question: 'समस्या कितनी गंभीर है? (How severe is it - High/Medium/Low?)' },
    { key: 'headache', question: 'क्या सिर दर्द है? (Do you have headache?)' },
    { key: 'nausea', question: 'क्या मतली है? (Do you have nausea?)' },
    { key: 'fatigue', question: 'क्या थकान है? (Do you feel fatigued?)' },
    { key: 'pain', question: 'क्या दर्द है? (Do you have pain?)' },
  ],
};


const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [waitingFor, setWaitingFor] = useState(null);
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [symptoms, setSymptoms] = useState({});
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [currentFollowUps, setCurrentFollowUps] = useState([]);
  const [showDoctorSuggestion, setShowDoctorSuggestion] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const appendMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const resetConversation = () => {
    setMessages([{ id: 1, role: 'bot', text: DEFAULT_BOT_MESSAGE }]);
    setOptions([]);
    setWaitingFor('userIntro');
    setFollowUpIndex(0);
    setSymptoms({});
    setLoadingPrediction(false);
    setCurrentFollowUps([]);
    setShowDoctorSuggestion(false);
    setInputDisabled(false);
  };

  useEffect(() => {
    if (open) {
      // Initialize conversation when opened for the first time.
      if (messages.length === 0) {
        resetConversation();
      }
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const askProblemType = () => {
    appendMessage({ id: Date.now(), role: 'bot', text: 'कृपया अपनी समस्या का प्रकार चुनें (Please select your problem type):' });
    setOptions(PROBLEM_TYPES);
    setWaitingFor('problemType');
    setInputDisabled(true);
  };

  const askPainLocation = () => {
    appendMessage({ id: Date.now(), role: 'bot', text: 'किस जगह दर्द है? (Where are you feeling pain?)' });
    setOptions(PAIN_LOCATIONS);
    setWaitingFor('painLocation');
    setInputDisabled(true);
  };

  const askFollowUpQuestion = (index, followUps = currentFollowUps) => {
    if (index >= followUps.length) {
      setWaitingFor(null);
      return;
    }

    const next = followUps[index];
    appendMessage({ id: Date.now(), role: 'bot', text: next.question });

    // Determine if this question needs option buttons or free text input
    if (['pain_frequency', 'fever_temperature', 'breathing_frequency', 'severity'].includes(next.key)) {
      setOptions([
        { label: 'High / हाँ', value: 1 },
        { label: 'Medium / कभी कभी', value: 0.5 },
        { label: 'Low / नहीं', value: 0 },
      ]);
      setInputDisabled(true);
    } else if (['symptom_description', 'pain_location', 'skin_location'].includes(next.key)) {
      // These require free text input
      setOptions([]);
      setInputDisabled(false);
    } else {
      // Yes/No questions
      setOptions([
        { label: 'हाँ (Yes)', value: 1 },
        { label: 'नहीं (No)', value: 0 },
      ]);
      setInputDisabled(true);
    }
    setWaitingFor(next.key);
  };

  const createSymptomVector = () => {
    const vector = {
      fever: 0,
      nausea: 0,
      fatigue: 0,
      breathing_problem: 0,
      chest_pain: 0,
      head_pain: 0,
      stomach_pain: 0,
      muscle_pain: 0,
      joint_pain: 0,
    };
    return { ...vector, ...symptoms };
  };

  const callPrediction = async () => {
    setLoadingPrediction(true);
    const vector = createSymptomVector();

    try {
      const token = localStorage.getItem('token');
      const origin = window.location.origin;
      const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ symptoms: vector }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Prediction failed');
      }

      const result = await response.json();

      const formatted = [];
      formatted.push({ id: Date.now() + 1, role: 'bot', text: '🏥 **Arovia Health Care विश्लेषण**' });
      formatted.push({ id: Date.now() + 2, role: 'bot', text: `📋 आपके लक्षणों के आधार पर: **${result.disease}** (Based on your symptoms: **${result.disease}**)` });

      if (result.causes && result.causes.length) {
        formatted.push({ id: Date.now() + 3, role: 'bot', text: '**संभावित कारण (Possible causes):**' });
        result.causes.forEach((c, idx) => {
          formatted.push({ id: Date.now() + 10 + idx, role: 'bot', text: `  • ${c}` });
        });
      }

      if (result.precautions && result.precautions.length) {
        formatted.push({ id: Date.now() + 100, role: 'bot', text: '**सावधानियाँ (Precautions):**' });
        result.precautions.forEach((p, idx) => {
          formatted.push({ id: Date.now() + 200 + idx, role: 'bot', text: `  • ${p}` });
        });
      }

      if (result.specialist) {
        formatted.push({ id: Date.now() + 300, role: 'bot', text: `**अनुशंसित विशेषज्ञ (Recommended specialist): ${result.specialist}**` });
      }

      // Sort doctors by rating (descending) and show top 3
      if (result.doctors && result.doctors.length) {
        const topDoctors = result.doctors
          .filter(doc => doc.Contact || doc.contact) // Ensure has contact info
          .sort((a, b) => {
            const ratingA = parseFloat(a.Rating) || 0;
            const ratingB = parseFloat(b.Rating) || 0;
            return ratingB - ratingA;
          })
          .slice(0, 3);

        formatted.push({ id: Date.now() + 400, role: 'bot', text: '⭐ **शीर्ष 3 सर्वश्रेष्ठ डॉक्टर (Top 3 Best Doctors):**' });

        topDoctors.forEach((doc, idx) => {
          const name = doc.Name || doc.name || 'Doctor';
          const specialty = doc.Specialization || doc.specialization || '';
          const hospital = doc.Hospital || doc.hospital || 'Hospital';
          const rating = doc.Rating || '4.5';
          const experience = doc.Experience || 'Experienced';
          const consultationFee = doc.Consultation_fee || 'Not specified';

          const docInfo = `
**${idx + 1}. ${name}**
└─ 🏥 ${specialty} @ ${hospital}
└─ ⭐ Rating: ${rating}/5 | 💼 ${experience}
└─ 💰 Fee: ${consultationFee}`;

          formatted.push({
            id: Date.now() + 500 + idx,
            role: 'bot',
            text: docInfo,
          });
        });
      }

      formatted.push({ id: Date.now() + 600, role: 'bot', text: 'क्या आप डॉक्टर से संपर्क करना चाहते हैं? (Do you want to book an appointment?)' });

      setMessages((prev) => [...prev, ...formatted]);
    } catch (err) {
      appendMessage({ id: Date.now(), role: 'bot', text: `⚠️ त्रुटि (Error): ${err.message || 'Unable to get prediction'}` });
    } finally {
      setLoadingPrediction(false);
      setOptions([{ label: 'फिर से शुरू करें (Start over)', value: 'reset' }]);
      setWaitingFor('reset');
    }
  };

  const handleOptionSelect = (option) => {
    const { label, value } = option;
    appendMessage({ id: Date.now(), role: 'user', text: label });

    // Reset options while processing
    setOptions([]);

    if (waitingFor === 'problemType') {
      setSymptoms((prev) => ({ ...prev, problem_type: value }));
      if (value === 'pain') {
        askPainLocation();
        return;
      }

      // Set specific symptom for fever or breathing
      if (value === 'fever') {
        setSymptoms((prev) => ({ ...prev, fever: 1 }));
      }
      if (value === 'breathing') {
        setSymptoms((prev) => ({ ...prev, breathing_problem: 1 }));
      }

      // Set follow-up questions based on problem type
      const followUps = PROBLEM_FOLLOW_UPS[value] || PROBLEM_FOLLOW_UPS.other;
      setCurrentFollowUps(followUps);
      setFollowUpIndex(0);
      askFollowUpQuestion(0, followUps);
      return;
    }

    if (waitingFor === 'painLocation') {
      setSymptoms((prev) => ({ ...prev, [value]: 1 }));
      setFollowUpIndex(0);
      const followUps = PROBLEM_FOLLOW_UPS.pain.slice(1);
      setCurrentFollowUps(followUps);
      askFollowUpQuestion(0, followUps);
      return;
    }

    // Follow-up yes/no responses (or any option-based follow up)
    const currentQuestion = currentFollowUps[followUpIndex];
    if (currentQuestion) {
      setSymptoms((prev) => ({ ...prev, [currentQuestion.key]: value }));
      const nextIndex = followUpIndex + 1;
      setFollowUpIndex(nextIndex);
      if (nextIndex < currentFollowUps.length) {
        askFollowUpQuestion(nextIndex);
      } else {
        // All questions answered, call prediction
        callPrediction();
      }
      return;
    }

    if (waitingFor === 'reset' && value === 'reset') {
      resetConversation();
      return;
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    appendMessage({ id: Date.now(), role: 'user', text: inputValue.trim() });
    setInputValue('');

    // Handle free-text follow-up questions
    const currentQuestion = currentFollowUps[followUpIndex];
    if (currentQuestion && ['symptom_description', 'pain_location', 'pain_duration', 'fever_duration', 'breathing_duration', 'breathing_frequency', 'skin_location', 'duration'].includes(currentQuestion.key)) {
      setSymptoms((prev) => ({ ...prev, [currentQuestion.key]: inputValue.trim() }));
      const nextIndex = followUpIndex + 1;
      setFollowUpIndex(nextIndex);
      if (nextIndex < currentFollowUps.length) {
        askFollowUpQuestion(nextIndex);
      } else {
        callPrediction();
      }
      return;
    }

    if (waitingFor === 'userIntro' || waitingFor === null) {
      askProblemType();
      return;
    }

    if (waitingFor === 'problemType') {
      askProblemType();
      return;
    }

    if (waitingFor === 'reset') {
      resetConversation();
      return;
    }
  };

  const botColor = useMemo(() => ({ backgroundColor: '#E8F3FF', color: '#0F4C5C' }), []);
  const userColor = useMemo(() => ({ backgroundColor: '#0F4C5C', color: '#ffffff' }), []);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'fixed', bottom: 80, right: 24, zIndex: 1500 }}
          >
            <Paper
              elevation={8}
              sx={{
                width: 380,
                maxHeight: 560,
                borderRadius: 3,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  background: 'linear-gradient(90deg, #0F4C5C, #2EC4B6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff' }}>
                    🏥 Arovia Health Care
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                    अपने लक्षणों के बारे में पूछें
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setOpen(false)}
                  sx={{ color: 'rgba(255,255,255,0.85)' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box
                ref={scrollRef}
                sx={{
                  flex: 1,
                  px: 2,
                  py: 1.5,
                  overflowY: 'auto',
                  background: '#F8FAFD',
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.role === 'bot' ? 'flex-start' : 'flex-end',
                      mb: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '90%',
                        px: 2,
                        py: 1.25,
                        borderRadius: 2,
                        ...(msg.role === 'bot' ? botColor : userColor),
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', lineHeight: 1.5 }}>
                        {msg.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ p: 2, borderTop: '1px solid rgba(15, 76, 92, 0.12)', background: '#fff' }}>
                {options.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {options.map((option) => (
                      <Button
                        key={option.value}
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOptionSelect(option)}
                        sx={{ textTransform: 'none', px: 1, py: 0.5, fontSize: '0.75rem' }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="अपना जवाब लिखें (Type your answer)..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      disabled={inputDisabled}
                      sx={{ fontSize: '0.85rem' }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSend}
                      disabled={inputDisabled || !inputValue.trim() || loadingPrediction}
                      size="small"
                      sx={{ bgcolor: '#0F4C5C', '&:hover': { bgcolor: '#0a3540' } }}
                    >
                      {loadingPrediction ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SendIcon sx={{ color: '#fff', fontSize: '1rem' }} />}
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      <Fab
        color="secondary"
        onClick={() => setOpen((prev) => !prev)}
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1500 }}
        aria-label="Open chatbot"
      >
        <ChatBubbleOutlineIcon />
      </Fab>
    </>
  );
};

export default Chatbot;
