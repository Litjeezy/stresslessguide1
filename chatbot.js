// Enhanced Chatbot functionality with improved reasoning
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotBox = document.getElementById('chatbotBox');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    
    // Enhanced state management
    let isChatbotOpen = false;
    let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    let conversationContext = {
        userStressLevel: null,
        preferredTechniques: [],
        currentTopic: null,
        sessionData: []
    };
    
    // Bot information
    const botName = "Calm Assistant";
    
    // Enhanced keyword system with weighted scoring
    const enhancedKeywords = {
        // Emotional states with intensity scoring
        anxiety: {
            high: ['panic', 'panicking', 'overwhelming anxiety', 'cant breathe', 'heart racing', 'panic attack'],
            medium: ['anxious', 'anxiety', 'nervous', 'worry', 'worried', 'uneasy', 'restless'],
            low: ['slightly anxious', 'bit nervous', 'little worried', 'mildly concerned']
        },
        stress: {
            high: ['extremely stressed', 'overwhelmed', 'breaking point', 'cant cope', 'too much pressure'],
            medium: ['stressed', 'stress', 'pressure', 'tense', 'tension', 'burned out'],
            low: ['little stressed', 'bit tense', 'minor stress', 'slightly overwhelmed']
        },
        fatigue: {
            high: ['exhausted', 'completely drained', 'no energy left', 'burnt out', 'dead tired'],
            medium: ['tired', 'fatigue', 'fatigued', 'drained', 'low energy', 'sleepy'],
            low: ['bit tired', 'slightly tired', 'need rest', 'feeling sluggish']
        },
        // Situation-based keywords
        situations: {
            work: ['work', 'office', 'job', 'meeting', 'boss', 'deadline', 'presentation', 'interview', 'coworkers'],
            public: ['public speaking', 'presentation', 'crowd', 'audience', 'social', 'people watching', 'performance'],
            personal: ['relationship', 'family', 'home', 'personal', 'life', 'friends', 'partner'],
            health: ['health', 'medical', 'doctor', 'illness', 'pain', 'physical', 'symptoms'],
            sleep: ['sleep', 'insomnia', 'cant sleep', 'bed', 'night', 'rest', 'trouble sleeping', 'lying awake']
        },
        // Intent keywords
        intents: {
            immediate_help: ['help now', 'right now', 'immediately', 'urgent', 'emergency', 'quick help', 'instant'],
            learn_technique: ['teach me', 'show me', 'how to', 'learn', 'technique', 'method', 'exercise'],
            understand_why: ['why', 'how does', 'explain', 'science', 'what happens', 'reason', 'because'],
            compare: ['which is better', 'compare', 'difference', 'best for', 'most effective', 'versus'],
            frequency: ['how often', 'how many times', 'daily', 'routine', 'schedule', 'practice'],
            effectiveness: ['does it work', 'effective', 'results', 'success', 'improvement', 'better']
        },
        // Question types
        question_types: {
            what: ['what is', 'what are', 'what does', 'what happens'],
            how: ['how to', 'how do', 'how does', 'how can', 'how long'],
            when: ['when to', 'when should', 'what time', 'how often'],
            where: ['where to', 'where can', 'where should'],
            which: ['which is', 'which one', 'which technique', 'which method'],
            why: ['why does', 'why is', 'why should', 'what causes']
        },
        // Yes/No responses
        yes: ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'definitely', 'absolutely', 'of course', 'certainly', 'ใช่', 'ตกลง', 'แน่นอน', 'ได้'],
        no: ['no', 'nope', 'nah', 'not really', 'not now', 'maybe later', 'not interested', 'ไม่', 'ไม่เอา', 'ไม่เป็นไร', 'ไม่สนใจ'],
        // Technique specific keywords
        exercise_keywords: {
            'physiological sigh': ['physiological sigh', 'sigh', 'double inhale', 'physio sigh', 'การหายใจแบบถอนหายใจ', 'ถอนหายใจ', 'หายใจเข้าสองครั้ง'],
            'box breathing': ['box breathing', 'box breath', 'navy seal', 'square breathing', '4-4-4-4', 'การหายใจแบบกล่อง', 'หายใจสี่เหลี่ยม', 'หายใจกล่อง'],
            '3-6-9 breathing': ['3-6-9', '369', 'three six nine', '3 6 9 breathing', 'สามหกเก้า', 'หายใจสามหกเก้า', 'สาม-หก-เก้า'],
            'tension release': ['tension release', 'muscle tension', 'tense and release', 'progressive muscle', 'คลายความตึงเครียด', 'ตึงและคลาย', 'เกร็งและคลาย'],
            'micro muscle': ['micro muscle', 'micro contraction', 'thumb palm', 'curl toes', 'discreet', 'กล้ามเนื้อจิ๋ว', 'กล้ามเนื้อขนาดเล็ก', 'นิ้วหัวแม่มือฝ่ามือ', 'งอนิ้วเท้า'],
            'pressure points': ['pressure points', 'acupressure', 'k27', 'li4', 'ear pull', 'tongue mudra', 'จุดกด', 'จุดกดรีเฟล็กซ์', 'จุดกดเพื่อผ่อนคลาย', 'ดึงหู', 'มุทรา'],
            'silent mantra': ['silent mantra', 'mantra', 'keyword repetition', 'mental repetition', 'word meditation', 'มนตราเงียบ', 'มนตรา', 'ท่องคำซ้ำ', 'ท่องในใจ']
        }
    };

    // Enhanced response system with context awareness
    const enhancedResponses = {
        en: {
            immediate_help: {
                high_anxiety: "I can hear the urgency in your message. Let's get you immediate relief. The **Physiological Sigh** is your fastest option - it works in just 30 seconds. Take a deep breath in through your nose, then a second smaller breath to top off your lungs, then slowly exhale through your mouth. This will immediately calm your nervous system.",
                high_stress: "I understand you need help right now. For immediate stress relief, try the **3-6-9 Breathing Pattern**: Breathe in for 3 seconds, hold for 6, exhale for 9. The long exhale activates your body's relaxation response instantly.",
                general: "For immediate relief, I recommend the **Physiological Sigh** - it's the fastest technique we have. Would you like me to guide you through it step by step?"
            },
            educational: {
                why_breathing: "Breathing techniques work because they directly influence your autonomic nervous system. When you're stressed, your sympathetic nervous system activates (fight-or-flight). Controlled breathing stimulates the vagus nerve, which activates your parasympathetic nervous system (rest-and-digest), lowering heart rate, blood pressure, and stress hormones.",
                why_tension: "Tension release works by interrupting the stress response cycle. When you voluntarily tense and then release muscles, you're essentially 'resetting' your nervous system and telling your brain that you're safe and in control.",
                how_habits_form: "Habits form through neuroplasticity - your brain literally rewires itself. The key is consistency: practice the same technique at the same time for 21 days, and it becomes automatic. Elite performers use 'implementation intentions' - specific if-then statements that make responses automatic."
            },
            personalized_recommendations: {
                work_stress: "For workplace stress, I recommend **Micro Muscle Contractions** - they're completely invisible. You can press your thumb into your palm, curl your toes, or press your tongue to the roof of your mouth during any meeting or stressful work situation.",
                public_anxiety: "For public situations, the **Silent Mantra** technique is perfect. Choose a word like 'calm' or 'steady' and repeat it silently. It gives your mind something to focus on while appearing completely normal to others.",
                sleep_issues: "For sleep problems, try the **3-6-9 Breathing Pattern** before bed. The extended exhale naturally relaxes your body and prepares it for sleep. Practice it lying down with lights off."
            },
            specific_techniques: {
                physiological_sigh: "The Physiological Sigh involves a double inhale through the nose followed by a long exhale through the mouth. This technique quickly activates your parasympathetic nervous system, reducing stress hormones and lowering heart rate within seconds.",
                box_breathing: "Box Breathing uses a 4-4-4-4 pattern: inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Navy SEALs use this technique to maintain calm and focus under extreme pressure.",
                tension_release: "The Tension Release technique involves tensing all your muscles for 5 seconds, then releasing while exhaling slowly. This interrupts the fight-or-flight response and gives your nervous system a physical 'reset'.",
                micro_muscle: "Micro Muscle Contractions are discreet stress relief techniques you can use anywhere. Press your thumb into your palm, curl your toes, or press your tongue to the roof of your mouth for 5 seconds to quickly reduce stress without anyone noticing."
            }
        },
        th: {
            immediate_help: {
                high_anxiety: "ฉันเข้าใจความเร่งด่วนในข้อความของคุณ มาให้ความช่วยเหลือทันทีกันเลย **การหายใจแบบถอนหายใจทางสรีรวิทยา** เป็นตัวเลือกที่เร็วที่สุด ใช้เวลาเพียง 30 วินาที หายใจเข้าลึกๆ ทางจมูก แล้วหายใจเข้าอีกครั้งเล็กน้อยเพื่อเติมเต็มปอด จากนั้นหายใจออกช้าๆ ทางปาก วิธีนี้จะทำให้ระบบประสาทของคุณสงบทันที",
                high_stress: "ฉันเข้าใจว่าคุณต้องการความช่วยเหลือตอนนี้ สำหรับการบรรเทาความเครียดทันที ลอง **รูปแบบการหายใจ 3-6-9**: หายใจเข้า 3 วินาที กลั้น 6 วินาที หายใจออก 9 วินาที การหายใจออกยาวจะกระตุ้นการตอบสนองการผ่อนคลายของร่างกายทันที",
                general: "สำหรับการบรรเทาทันที ฉันแนะนำ **การหายใจแบบถอนหายใจทางสรีรวิทยา** - เป็นเทคนิคที่เร็วที่สุดที่เรามี คุณต้องการให้ฉันแนะนำคุณทีละขั้นตอนไหม?"
            },
            educational: {
                why_breathing: "เทคนิคการหายใจได้ผลเพราะมีอิทธิพลโดยตรงต่อระบบประสาทอัตโนมัติของคุณ เมื่อคุณเครียด ระบบประสาทซิมพาเทติกจะทำงาน (สู้หรือหนี) การหายใจที่ควบคุมได้จะกระตุ้นเส้นประสาทเวกัส ซึ่งเปิดใช้งานระบบประสาทพาราซิมพาเทติก (พักผ่อนและย่อย) ลดอัตราการเต้นของหัวใจ ความดันโลหิต และฮอร์โมนความเครียด",
                why_tension: "การคลายความตึงเครียดได้ผลโดยการขัดขวางวงจรการตอบสนองความเครียด เมื่อคุณตั้งใจเกร็งแล้วคลายกล้ามเนื้อ คุณกำลัง 'รีเซ็ต' ระบบประสาทและบอกสมองว่าคุณปลอดภัยและควบคุมได้",
                how_habits_form: "นิสัยเกิดขึ้นผ่านความยืดหยุ่นของระบบประสาท - สมองของคุณเชื่อมต่อใหม่โดยตรง กุญแจสำคัญคือความสม่ำเสมอ: ฝึกเทคนิคเดียวกันในเวลาเดียวกันเป็นเวลา 21 วัน และมันจะกลายเป็นเรื่องอัตโนมัติ นักแสดงระดับสูงใช้ 'เจตนาการดำเนินการ' - คำสั่ง if-then เฉพาะที่ทำให้การตอบสนองเป็นอัตโนมัติ"
            },
            personalized_recommendations: {
                work_stress: "สำหรับความเครียดในที่ทำงาน ฉันแนะนำ **การหดตัวของกล้ามเนื้อขนาดเล็ก** - มองไม่เห็นเลย คุณสามารถกดนิ้วหัวแม่มือเข้าไปในฝ่ามือ งอนิ้วเท้า หรือกดลิ้นกับเพดานปากระหว่างการประชุมหรือสถานการณ์ที่เครียดในที่ทำงาน",
                public_anxiety: "สำหรับสถานการณ์สาธารณะ เทคนิค **มนตราเงียบ** เหมาะสมมาก เลือกคำเช่น 'สงบ' หรือ 'มั่นคง' และท่องซ้ำในใจ มันให้จิตใจของคุณมีสิ่งที่จะโฟกัสในขณะที่ดูปกติสำหรับคนอื่น",
                sleep_issues: "สำหรับปัญหาการนอนหลับ ลอง **รูปแบบการหายใจ 3-6-9** ก่อนนอน การหายใจออกยาวจะผ่อนคลายร่างกายตามธรรมชาติและเตรียมร่างกายสำหรับการนอนหลับ ฝึกฝนขณะนอนลงโดยปิดไฟ"
            },
            specific_techniques: {
                physiological_sigh: "การหายใจแบบถอนหายใจทางสรีรวิทยาเกี่ยวข้องกับการหายใจเข้าสองครั้งทางจมูกตามด้วยการหายใจออกยาวทางปาก เทคนิคนี้กระตุ้นระบบประสาทพาราซิมพาเทติกอย่างรวดเร็ว ลดฮอร์โมนความเครียดและลดอัตราการเต้นของหัวใจภายในไม่กี่วินาที",
                box_breathing: "การหายใจแบบกล่องใช้รูปแบบ 4-4-4-4: หายใจเข้า 4 วินาที กลั้น 4 วินาที หายใจออก 4 วินาที กลั้น 4 วินาที หน่วยซีลใช้เทคนิคนี้เพื่อรักษาความสงบและสมาธิภายใต้ความกดดันสูง",
                tension_release: "เทคนิคการคลายความตึงเครียดเกี่ยวข้องกับการเกร็งกล้ามเนื้อทั้งหมดเป็นเวลา 5 วินาที จากนั้นคลายขณะหายใจออกช้าๆ วิธีนี้จะขัดขวางการตอบสนองแบบสู้หรือหนีและให้ระบบประสาทของคุณ 'รีเซ็ต' ทางกายภาพ",
                micro_muscle: "การหดตัวของกล้ามเนื้อขนาดเล็กเป็นเทคนิคการบรรเทาความเครียดแบบไม่เปิดเผยที่คุณสามารถใช้ได้ทุกที่ กดนิ้วหัวแม่มือเข้าไปในฝ่ามือ งอนิ้วเท้า หรือกดลิ้นกับเพดานปากเป็นเวลา 5 วินาทีเพื่อลดความเครียดอย่างรวดเร็วโดยไม่มีใครสังเกตเห็น"
            }
        }
    };

    // Enhanced intent recognition system
    function analyzeUserInput(message) {
        const lowerMessage = message.toLowerCase();
        const analysis = {
            emotions: [],
            situation: null,
            intent: null,
            questionType: null,
            urgency: 'low',
            confidence: 0,
            techniqueReference: null
        };

        // Check for urgency and immediate help first
        if (enhancedKeywords.intents.immediate_help.some(keyword => lowerMessage.includes(keyword))) {
            analysis.urgency = 'high';
            analysis.intent = 'immediate_help';
        }

        // Analyze emotional state with intensity
        for (const emotion of ['anxiety', 'stress', 'fatigue']) {
            for (const level of ['high', 'medium', 'low']) {
                const keywords = enhancedKeywords[emotion]?.[level] || [];
                if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                    analysis.emotions.push({ type: emotion, level, confidence: level === 'high' ? 0.9 : level === 'medium' ? 0.7 : 0.5 });
                    break;
                }
            }
        }

        // Analyze situation context
        for (const [situation, keywords] of Object.entries(enhancedKeywords.situations)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                analysis.situation = situation;
                break;
            }
        }

        // Analyze intent
        for (const [intent, keywords] of Object.entries(enhancedKeywords.intents)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                analysis.intent = intent;
                break;
            }
        }

        // Analyze question type
        for (const [questionType, keywords] of Object.entries(enhancedKeywords.question_types)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                analysis.questionType = questionType;
                break;
            }
        }

        // Check for specific technique references
        for (const [technique, keywords] of Object.entries(enhancedKeywords.exercise_keywords)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                analysis.techniqueReference = technique;
                break;
            }
        }

        return analysis;
    }

    // Enhanced response generation
    function generateEnhancedResponse(analysis, message) {
        const responses = enhancedResponses[currentLanguage] || enhancedResponses.en;
        
        // Handle specific technique inquiries first
        if (analysis.techniqueReference) {
            const techniqueKey = mapTechniqueReferenceToKey(analysis.techniqueReference);
            if (responses.specific_techniques[techniqueKey]) {
                return responses.specific_techniques[techniqueKey];
            }
        }
        
        // Handle immediate help requests
        if (analysis.intent === 'immediate_help' || analysis.urgency === 'high') {
            const highestEmotion = analysis.emotions.reduce((max, emotion) => 
                emotion.level === 'high' ? emotion : max, null);
            
            if (highestEmotion) {
                if (highestEmotion.type === 'anxiety') {
                    return responses.immediate_help.high_anxiety;
                } else if (highestEmotion.type === 'stress') {
                    return responses.immediate_help.high_stress;
                }
            }
            return responses.immediate_help.general;
        }

        // Handle educational questions
        if (analysis.questionType === 'why' || analysis.intent === 'understand_why') {
            if (message.toLowerCase().includes('breathing') || message.toLowerCase().includes('หายใจ')) {
                return responses.educational.why_breathing;
            } else if (message.toLowerCase().includes('tension') || message.toLowerCase().includes('muscle') || message.toLowerCase().includes('กล้ามเนื้อ')) {
                return responses.educational.why_tension;
            } else if (message.toLowerCase().includes('habit') || message.toLowerCase().includes('นิสัย')) {
                return responses.educational.how_habits_form;
            }
        }

        // Handle situation-specific recommendations
        if (analysis.situation) {
            if (analysis.situation === 'work') {
                return responses.personalized_recommendations.work_stress;
            } else if (analysis.situation === 'public') {
                return responses.personalized_recommendations.public_anxiety;
            } else if (analysis.situation === 'sleep') {
                return responses.personalized_recommendations.sleep_issues;
            }
        }

        return null; // Fall back to original system
    }

    // Helper function to map technique reference to response key
    function mapTechniqueReferenceToKey(techniqueReference) {
        const mapping = {
            'physiological sigh': 'physiological_sigh',
            'box breathing': 'box_breathing',
            '3-6-9 breathing': 'breathing_369',
            'tension release': 'tension_release',
            'micro muscle': 'micro_muscle'
        };
        return mapping[techniqueReference] || techniqueReference;
    }

    // Enhanced technique matching with context
    function findBestTechniqueMatch(analysis, message) {
        const techniques = {
            physiological_sigh: {
                best_for: ['anxiety', 'immediate'],
                situations: ['any'],
                duration: 30,
                visibility: 'visible'
            },
            box_breathing: {
                best_for: ['focus', 'stress'],
                situations: ['work', 'public'],
                duration: 240,
                visibility: 'discreet'
            },
            breathing_369: {
                best_for: ['relaxation', 'sleep'],
                situations: ['home', 'private'],
                duration: 300,
                visibility: 'visible'
            },
            tension_release: {
                best_for: ['physical_stress', 'tension'],
                situations: ['private'],
                duration: 120,
                visibility: 'visible'
            },
            micro_muscle: {
                best_for: ['work_stress', 'discreet'],
                situations: ['work', 'public'],
                duration: 15,
                visibility: 'invisible'
            }
        };

        let bestMatch = null;
        let highestScore = 0;

        for (const [technique, properties] of Object.entries(techniques)) {
            let score = 0;

            // Score based on emotional state
            analysis.emotions.forEach(emotion => {
                if (properties.best_for.includes(emotion.type)) {
                    score += emotion.confidence * 2;
                }
            });

            // Score based on situation
            if (analysis.situation && properties.situations.includes(analysis.situation)) {
                score += 1.5;
            }

            // Score based on urgency
            if (analysis.urgency === 'high' && properties.duration <= 60) {
                score += 2;
            }

            // Score based on visibility requirements
            if (analysis.situation === 'work' || analysis.situation === 'public') {
                if (properties.visibility === 'invisible' || properties.visibility === 'discreet') {
                    score += 1;
                }
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = technique;
            }
        }

        return bestMatch;
    }

    // Chatbot translations (maintaining the existing structure for compatibility)
    window.chatbotTranslations = {
        en: {
            botName: "Calm Assistant",
            welcome: "Hello! I'm your enhanced Calm Assistant with improved reasoning capabilities. How are you feeling today?",
            yes_responses: [
                "That's great! I'm here to help you with any questions about the stress-relief techniques.",
                "Wonderful! What would you like to know more about?",
                "Perfect! How can I assist you further?",
                "Yes! I'm excited to help you on your wellness journey."
            ],
            no_responses: [
                "No problem at all! I'm here whenever you need guidance.",
                "That's okay! Feel free to ask me anything when you're ready.",
                "No worries! I'm always available to help when you need it.",
                "Understood! Let me know if there's anything else I can help with."
            ],
            assessment: [
                "How would you describe your stress level right now on a scale of 1-10?",
                "Are you looking for a technique you can use discreetly in public, or something for private practice?",
                "Do you need something for immediate relief, or are you building a long-term practice?",
                "What specific symptoms are you experiencing? (Tension, racing thoughts, fatigue, etc.)"
            ],
            feeling_anxious: [
                "I'm sorry to hear you're feeling anxious. Have you tried the Physiological Sigh technique from section 1? It takes just 30 seconds.",
                "Anxiety can be challenging. The Box Breathing technique might help you regain focus and calm. Would you like to try it?",
                "When you're anxious, your body might be in fight-or-flight mode. The Full Body Tension & Release technique can help reset your nervous system."
            ],
            feeling_stressed: [
                "Stress affects us all. Have you checked out the Tension Release technique? It's designed specifically for stress relief.",
                "For immediate stress relief, I recommend the 3-6-9 Breathing Pattern. It's excellent for calming your nervous system quickly.",
                "High stress can be managed with regular practice. The Micro Muscle Contractions are perfect for discreet stress relief in any situation."
            ],
            feeling_tired: [
                "Feeling tired is common when stressed. The Pressure Points technique can help revitalize your energy.",
                "Sometimes fatigue comes from mental strain. The Silent Mantra practice can help clear mental fog and boost energy.",
                "For tiredness, try the K27 point rubbing technique in section 4. It's specifically designed to recharge energy levels."
            ],
            feeling_good: [
                "That's wonderful! It's a great time to practice these techniques, as they're even more effective when you're already in a positive state.",
                "Excellent! Consider exploring the Habit Mastery section to make these techniques a permanent part of your routine.",
                "Great to hear! Which technique have you found most helpful so far?"
            ],
            language_responses: [
                "I notice you're asking about language. You can change the language using the dropdown in the top-right corner of the page.",
                "If you'd like to switch to Thai, click the language selector at the top right of the screen.",
                "You can view this entire guide in Thai by clicking the language dropdown in the top right corner."
            ],
            exercise_info: {
                physiological_sigh: {
                    name: 'Physiological Sigh',
                    description: 'A double inhale through the nose followed by a long exhale through the mouth. This technique quickly activates your parasympathetic nervous system.',
                    instructions: [
                        'Take a deep breath in through your nose until your lungs feel comfortably full',
                        'Without exhaling, take a second, shorter inhale through the nose to "top off" your lungs',
                        'Slowly exhale through your mouth until your lungs are completely empty',
                        'Repeat 1-3 times as needed'
                    ],
                    benefits: 'Reduces stress hormones, lowers heart rate, and provides immediate calm in 30 seconds',
                    section: 1,
                    duration: '30 seconds',
                    section_id: 'breathing'
                },
                box_breathing: {
                    name: 'Box Breathing',
                    description: 'Equal timing breathing pattern used by Navy SEALs for focus and calm under pressure.',
                    instructions: [
                        'Inhale for 4 seconds',
                        'Hold your breath for 4 seconds',
                        'Exhale for 4 seconds',
                        'Hold empty lungs for 4 seconds',
                        'Repeat the cycle'
                    ],
                    benefits: 'Improves focus, reduces anxiety, and builds mental resilience',
                    section: 1,
                    duration: '2-5 minutes',
                    section_id: 'breathing'
                },
                breathing_369: {
                    name: '3-6-9 Breathing Pattern',
                    description: 'Progressive breathing pattern with longer exhales to promote deep relaxation.',
                    instructions: [
                        'Inhale deeply for 3 seconds',
                        'Hold your breath for 6 seconds',
                        'Exhale slowly for 9 seconds',
                        'Repeat the cycle'
                    ],
                    benefits: 'Activates parasympathetic nervous system and promotes deep relaxation',
                    section: 1,
                    duration: '3-10 minutes',
                    section_id: 'breathing'
                },
                tension_release: {
                    name: 'Full Body Tension & Release',
                    description: 'Systematic tensing and releasing of all muscle groups to interrupt fight-or-flight response.',
                    instructions: [
                        'Take a full breath in through your nose',
                        'Tense every major muscle in your body for 5 seconds',
                        'Exhale slowly as you release all the tension',
                        'Pause and breathe naturally',
                        'Repeat 1-3 times'
                    ],
                    benefits: 'Releases physical tension and resets your nervous system',
                    section: 2,
                    duration: '1-2 minutes',
                    section_id: 'tension'
                },
                micro_muscle: {
                    name: 'Micro Muscle Contractions',
                    description: 'Discreet muscle contractions that can be done anywhere without being noticed.',
                    instructions: [
                        'Press your thumb firmly into your palm for 5 seconds',
                        'Curl your toes inside your shoes for 5 seconds',
                        'Press your tongue to the roof of your mouth for 5 seconds',
                        'Can be done individually or combined'
                    ],
                    benefits: 'Provides stress relief in public situations and activates calming response',
                    section: 3,
                    duration: '15-30 seconds',
                    section_id: 'micro-muscle'
                },
                pressure_points: {
                    name: 'Pressure Points',
                    description: 'Specific acupressure points that reset the nervous system when pressed.',
                    instructions: [
                        'LI4 Point: Pinch the web between thumb and index finger for 30 seconds',
                        'K27 Points: Gently rub points under your collarbones for 30-60 seconds',
                        'Ear Pull: Gently pull earlobes outward and down while breathing',
                        'Tongue Mudra: Place tongue on roof of mouth behind front teeth'
                    ],
                    benefits: 'Reduces tension, boosts energy, and activates healing response',
                    section: 4,
                    duration: '1-3 minutes',
                    section_id: 'pressure-points'
                },
                silent_mantra: {
                    name: 'Silent Mantra',
                    description: 'Mental repetition of a calming word to anchor focus and reduce mental noise.',
                    instructions: [
                        'Choose a calming word like "peace," "calm," "focus," or "steady"',
                        'Repeat the word silently in your mind',
                        'Keep looping for 30 seconds to 2 minutes',
                        'Return to the word whenever your mind wanders'
                    ],
                    benefits: 'Calms mental chatter, improves focus, and builds emotional control',
                    section: 5,
                    duration: '2-5 minutes',
                    section_id: 'silent-mantra'
                }
            }
        },
        th: {
            botName: "ผู้ช่วยคลายความเครียด",
            welcome: "สวัสดี! ฉันคือผู้ช่วยคลายความเครียดของคุณ คุณรู้สึกอย่างไรวันนี้?",
            yes_responses: [
                "ดีมาก! ฉันพร้อมช่วยตอบคำถามเกี่ยวกับเทคนิคการลดความเครียด",
                "วิเศษ! คุณอยากรู้เพิ่มเติมเกี่ยวกับอะไร?",
                "สมบูรณ์แบบ! ฉันจะช่วยคุณอย่างไรต่อไป?",
                "ใช่! ฉันตื่นเต้นที่จะช่วยคุณในการเดินทางสู่สุขภาพที่ดี"
            ],
            no_responses: [
                "ไม่เป็นไร! ฉันอยู่ที่นี่เมื่อคุณต้องการคำแนะนำ",
                "ไม่เป็นไร! อย่าลังเลที่จะถามฉันได้ทุกเมื่อเมื่อคุณพร้อม",
                "ไม่ต้องกังวล! ฉันพร้อมช่วยเหลือเสมอเมื่อคุณต้องการ",
                "เข้าใจแล้ว! แจ้งฉันได้หากมีอะไรที่ฉันสามารถช่วยได้"
            ],
            assessment: [
                "คุณจะอธิบายระดับความเครียดของคุณตอนนี้อย่างไรในระดับ 1-10?",
                "คุณกำลังมองหาเทคนิคที่คุณสามารถใช้อย่างไม่เปิดเผยในที่สาธารณะ หรือบางอย่างสำหรับการฝึกส่วนตัว?",
                "คุณต้องการบางอย่างสำหรับการบรรเทาทันที หรือกำลังสร้างการฝึกระยะยาว?",
                "คุณกำลังประสบกับอาการเฉพาะอะไรบ้าง? (ความตึงเครียด, ความคิดแล่นเร็ว, ความเหนื่อยล้า, ฯลฯ)"
            ],
            feeling_anxious: [
                "ฉันเสียใจที่ได้ยินว่าคุณกำลังรู้สึกวิตกกังวล คุณเคยลองเทคนิคการหายใจแบบถอนหายใจจากส่วนที่ 1 หรือไม่? ใช้เวลาเพียง 30 วินาที",
                "ความวิตกกังวลอาจเป็นความท้าทาย เทคนิคการหายใจแบบกล่องอาจช่วยให้คุณกลับมามีสมาธิและความสงบได้ คุณอยากลองไหม?",
                "เมื่อคุณวิตกกังวล ร่างกายของคุณอาจอยู่ในโหมดสู้หรือหนี เทคนิคการตึงและคลายกล้ามเนื้อทั้งร่างกายสามารถช่วยรีเซ็ตระบบประสาทของคุณได้"
            ],
            feeling_stressed: [
                "ความเครียดส่งผลกระทบต่อเราทุกคน คุณเคยลองเทคนิคการคลายความตึงเครียดหรือไม่? มันถูกออกแบบมาเฉพาะสำหรับการบรรเทาความเครียด",
                "สำหรับการบรรเทาความเครียดทันที ฉันแนะนำรูปแบบการหายใจ 3-6-9 มันยอดเยี่ยมสำหรับการทำให้ระบบประสาทของคุณสงบอย่างรวดเร็ว",
                "ความเครียดสูงสามารถจัดการได้ด้วยการฝึกฝนอย่างสม่ำเสมอ การหดตัวของกล้ามเนื้อขนาดเล็กเป็นวิธีที่เหมาะสำหรับการบรรเทาความเครียดอย่างไม่เปิดเผยในทุกสถานการณ์"
            ],
            feeling_tired: [
                "ความรู้สึกเหนื่อยเป็นเรื่องปกติเมื่อเครียด เทคนิคจุดกดสามารถช่วยฟื้นฟูพลังงานของคุณได้",
                "บางครั้งความเหนื่อยล้าเกิดจากความตึงเครียดทางจิตใจ การฝึกมนตราเงียบสามารถช่วยขจัดความสับสนทางจิตใจและเพิ่มพลังงานได้",
                "สำหรับความเหนื่อยล้า ลองใช้เทคนิคการนวดจุด K27 ในส่วนที่ 4 มันถูกออกแบบมาเฉพาะสำหรับการเพิ่มระดับพลังงาน"
            ],
            feeling_good: [
                "เยี่ยมมาก! นี่เป็นช่วงเวลาที่ดีในการฝึกฝนเทคนิคเหล่านี้ เพราะมันมีประสิทธิภาพมากขึ้นเมื่อคุณอยู่ในสภาวะที่ดีอยู่แล้ว",
                "ยอดเยี่ยม! ลองสำรวจส่วนการสร้างนิสัยระดับสูงเพื่อทำให้เทคนิคเหล่านี้เป็นส่วนหนึ่งของกิจวัตรของคุณอย่างถาวร",
                "ดีใจที่ได้ยินแบบนั้น! คุณพบว่าเทคนิคไหนมีประโยชน์มากที่สุดจนถึงตอนนี้?"
            ],
            language_responses: [
                "ฉันสังเกตเห็นว่าคุณกำลังถามเกี่ยวกับภาษา คุณสามารถเปลี่ยนภาษาได้โดยใช้เมนูแบบเลื่อนลงที่มุมขวาบนของหน้า",
                "หากคุณต้องการเปลี่ยนเป็นภาษาอังกฤษ ให้คลิกตัวเลือกภาษาที่มุมขวาบนของหน้าจอ",
                "คุณสามารถดูคู่มือนี้ทั้งหมดเป็นภาษาอังกฤษได้โดยคลิกเมนูภาษาแบบเลื่อนลงที่มุมขวาบน"
            ],
            exercise_info: {
                physiological_sigh: {
                    name: 'การหายใจแบบถอนหายใจทางสรีรวิทยา',
                    description: 'การหายใจเข้าสองครั้งทางจมูกตามด้วยการหายใจออกยาวทางปาก เทคนิคนี้กระตุ้นระบบประสาทพาราซิมพาเทติกของคุณอย่างรวดเร็ว',
                    instructions: [
                        'หายใจเข้าลึกๆ ทางจมูกจนรู้สึกว่าปอดเต็มอย่างสบาย',
                        'โดยไม่ต้องหายใจออก ให้หายใจเข้าอีกครั้งสั้นๆ ทางจมูกเพื่อ "เติมเต็ม" ปอดของคุณ',
                        'หายใจออกช้าๆ ทางปากจนปอดของคุณว่างเปล่าโดยสิ้นเชิง',
                        'ทำซ้ำ 1-3 ครั้งตามความจำเป็น'
                    ],
                    benefits: 'ลดฮอร์โมนความเครียด ลดอัตราการเต้นของหัวใจ และให้ความสงบทันทีใน 30 วินาที',
                    section: 1,
                    duration: '30 วินาที',
                    section_id: 'breathing'
                },
                box_breathing: {
                    name: 'การหายใจแบบกล่อง',
                    description: 'รูปแบบการหายใจที่มีจังหวะเท่ากันใช้โดยหน่วยซีลเพื่อรักษาสมาธิและความสงบภายใต้ความกดดัน',
                    instructions: [
                        'หายใจเข้า 4 วินาที',
                        'กลั้นหายใจ 4 วินาที',
                        'หายใจออก 4 วินาที',
                        'กลั้นหายใจเมื่อปอดว่าง 4 วินาที',
                        'ทำซ้ำวงจร'
                    ],
                    benefits: 'ปรับปรุงสมาธิ ลดความวิตกกังวล และสร้างความยืดหยุ่นทางจิตใจ',
                    section: 1,
                    duration: '2-5 นาที',
                    section_id: 'breathing'
                },
                breathing_369: {
                    name: 'รูปแบบการหายใจ 3-6-9',
                    description: 'รูปแบบการหายใจแบบก้าวหน้าด้วยการหายใจออกที่ยาวนานขึ้นเพื่อส่งเสริมการผ่อนคลายอย่างลึกซึ้ง',
                    instructions: [
                        'หายใจเข้าลึกๆ เป็นเวลา 3 วินาที',
                        'กลั้นหายใจเป็นเวลา 6 วินาที',
                        'หายใจออกช้าๆ เป็นเวลา 9 วินาที',
                        'ทำซ้ำวงจร'
                    ],
                    benefits: 'กระตุ้นระบบประสาทพาราซิมพาเทติกและส่งเสริมการผ่อนคลายอย่างลึกซึ้ง',
                    section: 1,
                    duration: '3-10 นาที',
                    section_id: 'breathing'
                },
                tension_release: {
                    name: 'การตึงและคลายกล้ามเนื้อทั้งร่างกาย',
                    description: 'การเกร็งและคลายกลุ่มกล้ามเนื้อทั้งหมดอย่างเป็นระบบเพื่อขัดขวางการตอบสนองแบบสู้หรือหนี',
                    instructions: [
                        'หายใจเข้าเต็มที่ทางจมูก',
                        'เกร็งกล้ามเนื้อสำคัญทุกส่วนในร่างกายของคุณเป็นเวลา 5 วินาที',
                        'หายใจออกช้าๆ ขณะที่คุณคลายความตึงเครียดทั้งหมด',
                        'หยุดพักและหายใจตามธรรมชาติ',
                        'ทำซ้ำ 1-3 ครั้ง'
                    ],
                    benefits: 'ปล่อยความตึงเครียดทางกายภาพและรีเซ็ตระบบประสาทของคุณ',
                    section: 2,
                    duration: '1-2 นาที',
                    section_id: 'tension'
                },
                micro_muscle: {
                    name: 'การหดตัวของกล้ามเนื้อขนาดเล็ก',
                    description: 'การหดตัวของกล้ามเนื้อที่แทบไม่สังเกตเห็นซึ่งสามารถทำได้ทุกที่โดยไม่มีใครสังเกตเห็น',
                    instructions: [
                        'กดนิ้วหัวแม่มือของคุณเข้าไปในฝ่ามืออย่างแน่นหนาเป็นเวลา 5 วินาที',
                        'งอนิ้วเท้าของคุณในรองเท้าเป็นเวลา 5 วินาที',
                        'กดลิ้นของคุณกับเพดานปากเป็นเวลา 5 วินาที',
                        'สามารถทำเป็นรายบุคคลหรือรวมกันได้'
                    ],
                    benefits: 'ให้การบรรเทาความเครียดในสถานการณ์สาธารณะและกระตุ้นการตอบสนองการผ่อนคลาย',
                    section: 3,
                    duration: '15-30 วินาที',
                    section_id: 'micro-muscle'
                },
                pressure_points: {
                    name: 'จุดกดเพื่อผ่อนคลาย',
                    description: 'จุดกดเฉพาะที่ช่วยรีเซ็ตระบบประสาทเมื่อกด',
                    instructions: [
                        'จุด LI4: บีบเนื้อเยื่อระหว่างนิ้วหัวแม่มือและนิ้วชี้เป็นเวลา 30 วินาที',
                        'จุด K27: นวดเบาๆ ที่จุดใต้กระดูกไหปลาร้าเป็นเวลา 30-60 วินาที',
                        'การดึงหู: ดึงติ่งหูออกไปด้านข้างและลงเบาๆ ขณะหายใจ',
                        'ลิ้นมุทรา: วางลิ้นบนเพดานปากด้านหลังฟันหน้า'
                    ],
                    benefits: 'ลดความตึงเครียด เพิ่มพลังงาน และกระตุ้นการตอบสนองการรักษา',
                    section: 4,
                    duration: '1-3 นาที',
                    section_id: 'pressure-points'
                },
                silent_mantra: {
                    name: 'มนตราเงียบ',
                    description: 'การท่องคำสงบในใจซ้ำๆ เพื่อยึดเหนี่ยวสมาธิและลดเสียงรบกวนทางจิตใจ',
                    instructions: [
                        'เลือกคำที่ทำให้สงบเช่น "สงบ" "สันติ" "สมาธิ" หรือ "มั่นคง"',
                        'ท่องคำนั้นเงียบๆ ในใจของคุณ',
                        'ท่องต่อเนื่องเป็นเวลา 30 วินาทีถึง 2 นาที',
                        'กลับมาที่คำนั้นเมื่อใดก็ตามที่จิตใจของคุณเริ่มวอกแวก'
                    ],
                    benefits: 'ทำให้เสียงรบกวนในใจสงบลง ปรับปรุงสมาธิ และสร้างการควบคุมอารมณ์',
                    section: 5,
                    duration: '2-5 นาที',
                    section_id: 'silent-mantra'
                }
            }
        }
    };
    
    // Map exercise keys to their Thai translations
    const exerciseTranslationMap = {
        'physiological sigh': {
            en: 'physiological_sigh',
            th: 'physiological_sigh'
        },
        'box breathing': {
            en: 'box_breathing',
            th: 'box_breathing'
        },
        '3-6-9 breathing': {
            en: 'breathing_369',
            th: 'breathing_369'
        },
        'tension release': {
            en: 'tension_release',
            th: 'tension_release'
        },
        'micro muscle': {
            en: 'micro_muscle',
            th: 'micro_muscle'
        },
        'pressure points': {
            en: 'pressure_points',
            th: 'pressure_points'
        },
        'silent mantra': {
            en: 'silent_mantra',
            th: 'silent_mantra'
        }
    };
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function() {
        if (!isChatbotOpen) {
            openChatbot();
        } else {
            closeChatbot();
        }
    });
    
    // Close button
    chatbotClose.addEventListener('click', function() {
        closeChatbot();
    });
    
    // Send message when button is clicked
    chatbotSend.addEventListener('click', function() {
        sendMessage();
    });
    
    // Send message when Enter key is pressed
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Open chatbot and display welcome message
    function openChatbot() {
        chatbotBox.style.display = 'flex';
        chatbotBox.classList.add('chatbot-open');
        isChatbotOpen = true;
        
        // Only add welcome message if there are no messages yet
        if (chatbotMessages.children.length === 0) {
            setTimeout(function() {
                const welcomeMsg = window.chatbotTranslations[currentLanguage]?.welcome || botResponses.welcome;
                addBotMessage(welcomeMsg);
                // After welcome message, ask first assessment question
                setTimeout(function() {
                    const assessmentMsg = window.chatbotTranslations[currentLanguage]?.assessment[0] || assessmentQuestions[0];
                    addBotMessage(assessmentMsg);
                }, 1000);
            }, 500);
        }
    }
    
    // Close chatbot
    function closeChatbot() {
        chatbotBox.classList.remove('chatbot-open');
        setTimeout(function() {
            chatbotBox.style.display = 'none';
            isChatbotOpen = false;
        }, 300);
    }
    
    // Add a message from the user
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.innerHTML = `<p>${message}</p>`;
        chatbotMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Add a message from the bot
    function addBotMessage(message) {
        const currentBotName = window.chatbotTranslations[currentLanguage]?.botName || botName;
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        messageElement.innerHTML = `
            <div class="bot-avatar">${currentLanguage === 'th' ? 'ผช' : 'CA'}</div>
            <div class="message-content">
                <span class="bot-name">${currentBotName}</span>
                <p>${message}</p>
            </div>
        `;
        chatbotMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Add exercise information message
    function addExerciseInfo(exerciseKey) {
        // Get the proper exercise key based on language
        const translatedKey = exerciseTranslationMap[exerciseKey]?.[currentLanguage] || exerciseKey;
        const exercise = window.chatbotTranslations[currentLanguage]?.exercise_info?.[translatedKey];
        
        if (!exercise) return;
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message', 'exercise-info');
        
        let instructionsList = '';
        exercise.instructions.forEach((instruction, index) => {
            instructionsList += `<li><strong>${currentLanguage === 'th' ? 'ขั้นตอนที่' : 'Step'} ${index + 1}:</strong> ${instruction}</li>`;
        });
        
        const currentBotName = window.chatbotTranslations[currentLanguage]?.botName || botName;
        const descriptionLabel = currentLanguage === 'th' ? 'คำอธิบาย' : 'Description';
        const durationLabel = currentLanguage === 'th' ? 'ระยะเวลา' : 'Duration';
        const instructionsLabel = currentLanguage === 'th' ? 'วิธีทำ' : 'How to do it';
        const benefitsLabel = currentLanguage === 'th' ? 'ประโยชน์' : 'Benefits';
        const sectionText = currentLanguage === 'th' ? 
            `คุณสามารถค้นหาการฝึกนี้ได้ในส่วนที่ ${exercise.section} ของคู่มือ` :
            `You can find this exercise in Section ${exercise.section} of the guide.`;
        
        messageElement.innerHTML = `
            <div class="bot-avatar">${currentLanguage === 'th' ? 'ผช' : 'CA'}</div>
            <div class="message-content">
                <span class="bot-name">${currentBotName}</span>
                <div class="exercise-card">
                    <h4>${exercise.name}</h4>
                    <p><strong>${descriptionLabel}:</strong> ${exercise.description}</p>
                    <p><strong>${durationLabel}:</strong> ${exercise.duration}</p>
                    <div class="instructions">
                        <strong>${instructionsLabel}:</strong>
                        <ol>${instructionsList}</ol>
                    </div>
                    <p><strong>${benefitsLabel}:</strong> ${exercise.benefits}</p>
                    <p><em>${sectionText}</em></p>
                </div>
            </div>
        `;
        chatbotMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Enhanced suggestion system with navigation links
    function addSuggestions(suggestions, navigationOptions = null) {
        const suggestionsElement = document.createElement('div');
        suggestionsElement.classList.add('suggestions');
        
        let buttonsHTML = '';
        suggestions.forEach((suggestion, index) => {
            const hasNavigation = navigationOptions && navigationOptions[index];
            const navClass = hasNavigation ? ' has-navigation' : '';
            const navData = hasNavigation ? ` data-section="${navigationOptions[index]}"` : '';
            buttonsHTML += `<button class="suggestion-btn${navClass}"${navData}>${suggestion}</button>`;
        });
        
        suggestionsElement.innerHTML = buttonsHTML;
        chatbotMessages.appendChild(suggestionsElement);
        
        // Add event listeners to suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(button => {
            button.addEventListener('click', function() {
                const message = this.textContent;
                const sectionId = this.getAttribute('data-section');
                
                addUserMessage(message);
                // Remove the suggestions
                this.parentElement.remove();
                
                // Check if this button should navigate to a section
                if (sectionId && this.classList.contains('has-navigation')) {
                    // Navigate to section after processing
                    setTimeout(() => {
                        navigateToSection(sectionId);
                        addBotMessage(currentLanguage === 'th' ? 
                            `ฉันจะพาคุณไปที่ส่วนที่เกี่ยวข้องของคู่มือ` :
                            `I'll take you to the relevant section of the guide.`);
                    }, 500);
                } else {
                    // Process regular response
                    processUserInput(message);
                }
            });
        });
        
        scrollToBottom();
    }

    // Enhanced suggestions with navigation mapping
    function addSmartSuggestions(suggestionData) {
        const suggestions = [];
        const navigationOptions = [];
        
        suggestionData.forEach(item => {
            if (typeof item === 'string') {
                suggestions.push(item);
                navigationOptions.push(null);
            } else {
                suggestions.push(item.text);
                navigationOptions.push(item.section || null);
            }
        });
        
        addSuggestions(suggestions, navigationOptions);
    }

    // Navigation helper function
    function navigateToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            // Close chatbot first
            closeChatbot();
            // Navigate to section
            setTimeout(() => {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                // Highlight the section briefly
                targetElement.style.animation = 'highlight-section 2s ease-in-out';
                setTimeout(() => {
                    targetElement.style.animation = '';
                }, 2000);
            }, 300);
        }
    }
    
    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message !== '') {
            addUserMessage(message);
            chatbotInput.value = '';
            
            // Process user input and generate response
            processUserInput(message);
        }
    }
    
    // Enhanced process user input
    function processUserInput(message) {
        // Analyze the message
        const analysis = analyzeUserInput(message);
        
        // Store in conversation context
        conversationContext.sessionData.push({
            message,
            analysis,
            timestamp: Date.now()
        });
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate processing time
        setTimeout(function() {
            removeTypingIndicator();
            
            // Try enhanced response first
            const enhancedResponse = generateEnhancedResponse(analysis, message);
            
            if (enhancedResponse) {
                addBotMessage(enhancedResponse);
                
                // Offer technique if appropriate
                if (analysis.intent !== 'understand_why' && !analysis.techniqueReference) {
                    setTimeout(() => {
                        const suggestionData = currentLanguage === 'th' ? [
                            {text: "ช่วยฉันรู้สึกดีขึ้น", section: "breathing"},
                            {text: "แสดงเทคนิคทั้งหมด", section: "intro"},
                            {text: "ฉันมีคำถามเฉพาะ"}
                        ] : [
                            {text: "Help me feel better", section: "breathing"},
                            {text: "Show all techniques", section: "intro"},
                            {text: "I have a specific question"}
                        ];
                        addSmartSuggestions(suggestionData);
                    }, 1000);
                }
                
                return;
            }
            
            // Check for specific exercise keywords
            const exerciseMatch = checkForExerciseKeywords(message);
            if (exerciseMatch) {
                const translatedKey = exerciseTranslationMap[exerciseMatch]?.[currentLanguage] || exerciseMatch;
                const exerciseName = window.chatbotTranslations[currentLanguage]?.exercise_info?.[translatedKey]?.name || exerciseMatch;
                
                const responseMessage = currentLanguage === 'th' ? 
                    `นี่คือข้อมูลโดยละเอียดเกี่ยวกับ${exerciseName}:` :
                    `Here's detailed information about the ${exerciseName}:`;
                
                addBotMessage(responseMessage);
                
                setTimeout(() => {
                    addExerciseInfo(exerciseMatch);
                    setTimeout(() => {
                        // Try to navigate to section if exerciseInfo has section_id
                        const sectionId = window.chatbotTranslations[currentLanguage]?.exercise_info?.[translatedKey]?.section_id;
                        
                        const suggestionData = currentLanguage === 'th' ? [
                            {text: "ลองเทคนิคนี้"},
                            {text: "แสดงเทคนิคอื่น"},
                            {text: "พาฉันไปที่ส่วนนี้", section: sectionId},
                            {text: "ฉันควรฝึกบ่อยแค่ไหน?", section: "habit-mastery"}
                        ] : [
                            {text: "Try this exercise"},
                            {text: "Show me another technique"},
                            {text: "Take me to this section", section: sectionId},
                            {text: "How often should I practice?", section: "habit-mastery"}
                        ];
                        
                        addSmartSuggestions(suggestionData);
                    }, 1000);
                }, 500);
                return;
            }
            
            // Check for feeling keywords
            if (containsKeywords(message.toLowerCase(), enhancedKeywords.anxiety.high) || 
                containsKeywords(message.toLowerCase(), enhancedKeywords.anxiety.medium)) {
                const response = getRandomResponse(window.chatbotTranslations[currentLanguage]?.feeling_anxious || botResponses.feeling_anxious);
                addBotMessage(response);
                setTimeout(() => {
                    const suggestionData = currentLanguage === 'th' ? [
                        {text: "แสดงฉันการหายใจแบบถอนหายใจ", section: "breathing"},
                        {text: "ฉันต้องการอะไรที่ไม่เปิดเผย", section: "micro-muscle"},
                        {text: "บอกฉันเพิ่มเติมเกี่ยวกับการบรรเทาความวิตกกังวล"}
                    ] : [
                        {text: "Show me the Physiological Sigh", section: "breathing"},
                        {text: "I need something discreet", section: "micro-muscle"},
                        {text: "Tell me more about anxiety relief"}
                    ];
                    addSmartSuggestions(suggestionData);
                }, 1000);
            }
            else if (containsKeywords(message.toLowerCase(), enhancedKeywords.stress.high) || 
                     containsKeywords(message.toLowerCase(), enhancedKeywords.stress.medium)) {
                const response = getRandomResponse(window.chatbotTranslations[currentLanguage]?.feeling_stressed || botResponses.feeling_stressed);
                addBotMessage(response);
                setTimeout(() => {
                    const suggestionData = currentLanguage === 'th' ? [
                        {text: "บอกฉันเกี่ยวกับการคลายความตึงเครียด", section: "tension"},
                        {text: "ฉันต้องการบรรเทาทันที", section: "breathing"},
                        {text: "อะไรทำให้เกิดความเครียด?"}
                    ] : [
                        {text: "Tell me about Tension Release", section: "tension"},
                        {text: "I need immediate relief", section: "breathing"},
                        {text: "What causes stress?"}
                    ];
                    addSmartSuggestions(suggestionData);
                }, 1000);
            }
            else if (containsKeywords(message.toLowerCase(), enhancedKeywords.fatigue.high) || 
                     containsKeywords(message.toLowerCase(), enhancedKeywords.fatigue.medium)) {
                const response = getRandomResponse(window.chatbotTranslations[currentLanguage]?.feeling_tired || botResponses.feeling_tired);
                addBotMessage(response);
                setTimeout(() => {
                    const suggestionData = currentLanguage === 'th' ? [
                        {text: "แสดงฉันจุด K27", section: "pressure-points"},
                        {text: "ฉันต้องการพลังงานตอนนี้", section: "pressure-points"},
                        {text: "ทำไมฉันถึงเหนื่อยตลอดเวลา?"}
                    ] : [
                        {text: "Show me the K27 points", section: "pressure-points"},
                        {text: "I need energy now", section: "pressure-points"},
                        {text: "Why am I always tired?"}
                    ];
                    addSmartSuggestions(suggestionData);
                }, 1000);
            }
            else if (containsKeywords(message.toLowerCase(), enhancedKeywords.yes)) {
                const response = getRandomResponse(window.chatbotTranslations[currentLanguage]?.yes_responses || botResponses.yes_responses);
                addBotMessage(response);
                setTimeout(() => {
                    const suggestionData = currentLanguage === 'th' ? [
                        {text: "บอกฉันเกี่ยวกับเทคนิค", section: "intro"},
                        {text: "ฉันต้องการบรรเทาทันที", section: "breathing"},
                        {text: "ช่วยกับความวิตกกังวล", section: "breathing"},
                        {text: "แสดงการฝึกให้ฉันดู", section: "breathing"}
                    ] : [
                        {text: "Tell me about techniques", section: "intro"},
                        {text: "I need quick relief", section: "breathing"},
                        {text: "Help with anxiety", section: "breathing"},
                        {text: "Show me exercises", section: "breathing"}
                    ];
                    addSmartSuggestions(suggestionData);
                }, 1000);
            }
            else if (containsKeywords(message.toLowerCase(), enhancedKeywords.no)) {
                const response = getRandomResponse(window.chatbotTranslations[currentLanguage]?.no_responses || botResponses.no_responses);
                addBotMessage(response);
                setTimeout(() => {
                    const suggestionData = currentLanguage === 'th' ? [
                        {text: "ไว้คราวหลัง"},
                        {text: "ฉันมีคำถาม"},
                        {text: "บอกฉันเกี่ยวกับประโยชน์", section: "habit-mastery"},
                        {text: "มีเทคนิคอะไรบ้าง?", section: "intro"}
                    ] : [
                        {text: "Maybe later"},
                        {text: "I have a question"},
                        {text: "Tell me about benefits", section: "habit-mastery"},
                        {text: "What techniques are available?", section: "intro"}
                    ];
                    addSmartSuggestions(suggestionData);
                }, 1000);
            }
            // Default response for unclear messages
            else {
                const response = currentLanguage === 'th' ? 
                    "ฉันอยู่ที่นี่เพื่อช่วยคุณหาเทคนิคการจัดการความเครียดที่เหมาะสม คุณต้องการคำแนะนำตามความต้องการของคุณไหม?" :
                    "I'm here to help you find the right stress management technique. Would you like a recommendation based on your needs?";
                addBotMessage(response);
                setTimeout(() => {
                    const suggestionData = currentLanguage === 'th' ? [
                        {text: "ใช่ แนะนำให้ฉันหน่อย", section: "breathing"},
                        {text: "แสดงเทคนิคทั้งหมด", section: "intro"},
                        {text: "ฉันมีคำถามเฉพาะ"}
                    ] : [
                        {text: "Yes, recommend something", section: "breathing"},
                        {text: "Show all techniques", section: "intro"},
                        {text: "I have a specific question"}
                    ];
                    addSmartSuggestions(suggestionData);
                }, 1000);
            }
        }, 1000);
    }
    
    // Check for exercise keywords and provide info
    function checkForExerciseKeywords(message) {
        const lowerMessage = message.toLowerCase();
        
        for (const [exerciseKey, keywordList] of Object.entries(enhancedKeywords.exercise_keywords)) {
            if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
                return exerciseKey;
            }
        }
        return null;
    }
    
    // Check if message contains any keywords from the array
    function containsKeywords(message, keywordArray) {
        return keywordArray.some(keyword => message.includes(keyword));
    }
    
    // Get random response from array
    function getRandomResponse(responseArray) {
        if (!responseArray || responseArray.length === 0) {
            return "I'm here to help. What would you like to know?";
        }
        return responseArray[Math.floor(Math.random() * responseArray.length)];
    }
    
    // Helper function to get technique names
    function getTechniqueName(techniqueKey) {
        const names = {
            en: {
                physiological_sigh: 'Physiological Sigh',
                box_breathing: 'Box Breathing',
                breathing_369: '3-6-9 Breathing',
                tension_release: 'Tension Release',
                micro_muscle: 'Micro Muscle Contractions'
            },
            th: {
                physiological_sigh: 'การหายใจแบบถอนหายใจทางสรีรวิทยา',
                box_breathing: 'การหายใจแบบกล่อง',
                breathing_369: 'การหายใจ 3-6-9',
                tension_release: 'การคลายความตึงเครียด',
                micro_muscle: 'การหดตัวของกล้ามเนื้อขนาดเล็ก'
            }
        };
        return names[currentLanguage]?.[techniqueKey] || techniqueKey;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = `
            <div class="bot-avatar">${currentLanguage === 'th' ? 'ผช' : 'CA'}</div>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatbotMessages.appendChild(typingIndicator);
        scrollToBottom();
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Scroll to bottom of chat
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Update chatbot language function
    window.updateChatbotLanguage = function(lang) {
        currentLanguage = lang;
        // Update bot name display in existing messages
        document.querySelectorAll('.bot-name').forEach(nameElement => {
            const newBotName = window.chatbotTranslations[lang]?.botName || botName;
            nameElement.textContent = newBotName;
        });
        
        // Update bot avatars
        document.querySelectorAll('.bot-avatar').forEach(avatar => {
            avatar.textContent = lang === 'th' ? 'ผช' : 'CA';
        });
        
        // Update placeholder
        if (chatbotInput) {
            const placeholder = lang === 'th' ? 'บอกฉันว่าคุณรู้สึกอย่างไร...' : 'Tell me how you\'re feeling...';
            chatbotInput.placeholder = placeholder;
        }
    };
});