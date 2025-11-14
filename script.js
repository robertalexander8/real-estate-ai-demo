// Chat functionality
const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const closeButton = document.getElementById('closeButton');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

// Conversation state
let conversationStep = 0;
let leadData = {
    type: '',
    budget: '',
    neighborhoods: '',
    preApproved: '',
    timeline: '',
    contact: ''
};

// Conversation flow
const conversation = [
    {
        question: "Hi! I'm here to help you find your perfect Brooklyn home. Are you looking to buy or sell?",
        options: ['Buy', 'Sell'],
        key: 'type'
    },
    {
        question: "Great! What's your budget range?",
        options: ['Under $500K', '$500K-$1M', '$1M-$2M', '$2M+', 'Not sure yet'],
        key: 'budget'
    },
    {
        question: "Which Brooklyn neighborhoods interest you most?",
        placeholder: "e.g., Park Slope, Williamsburg, Brooklyn Heights...",
        freeText: true,
        key: 'neighborhoods'
    },
    {
        question: "Are you pre-approved for a mortgage?",
        options: ['Yes', 'No', 'Paying cash'],
        key: 'preApproved'
    },
    {
        question: "What's your timeline for buying?",
        options: ['ASAP', 'Within 3 months', '3-6 months', '6+ months', 'Just browsing'],
        key: 'timeline'
    },
    {
        question: "Perfect! I'll connect you with one of our agents. What's the best email to reach you?",
        placeholder: "your@email.com",
        freeText: true,
        key: 'contact'
    }
];

// Open/Close chat
if (chatButton) {
    chatButton.addEventListener('click', function() {
        chatWindow.classList.add('active');
        chatButton.style.display = 'none';
    });
}

if (closeButton) {
    closeButton.addEventListener('click', function() {
        chatWindow.classList.remove('active');
        chatButton.style.display = 'flex';
    });
}

// Send message
if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Store response
    if (conversationStep < conversation.length) {
        leadData[conversation[conversationStep].key] = message;
        conversationStep++;
    }

    // Delay bot response
    setTimeout(function() {
        if (conversationStep < conversation.length) {
            askQuestion(conversationStep);
        } else {
            finishConversation();
        }
    }, 800);
}

function askQuestion(step) {
    const current = conversation[step];
    addMessage(current.question, 'bot');

    // If has options, show them as quick replies
    if (current.options) {
        setTimeout(function() {
            addQuickReplies(current.options);
        }, 300);
    }

    // Update placeholder
    if (current.placeholder) {
        chatInput.placeholder = current.placeholder;
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + sender + '-message';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addQuickReplies(options) {
    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'quick-replies';
    repliesDiv.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;';

    options.forEach(function(option) {
        const button = document.createElement('button');
        button.textContent = option;
        button.style.cssText = 'background: #f0f0f0; border: 1px solid #ddd; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;';
        
        button.addEventListener('mouseover', function() {
            button.style.background = '#1e3c72';
            button.style.color = 'white';
        });
        
        button.addEventListener('mouseout', function() {
            button.style.background = '#f0f0f0';
            button.style.color = '#333';
        });

        button.addEventListener('click', function() {
            chatInput.value = option;
            sendMessage();
            repliesDiv.remove();
        });

        repliesDiv.appendChild(button);
    });

    chatMessages.appendChild(repliesDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function finishConversation() {
    addMessage("Excellent! 🎉", 'bot');
    
    setTimeout(function() {
        addMessage('Here\'s what I\'ve captured:\n\n' +
            '📍 Type: ' + leadData.type + '\n' +
            '💰 Budget: ' + leadData.budget + '\n' +
            '🏘️ Neighborhoods: ' + leadData.neighborhoods + '\n' +
            '✅ Pre-approved: ' + leadData.preApproved + '\n' +
            '📅 Timeline: ' + leadData.timeline + '\n' +
            '📧 Contact: ' + leadData.contact + '\n\n' +
            'An agent will reach out within 24 hours with personalized property recommendations. Thanks!', 'bot');
        
        // Log lead data (in real version, this sends to CRM/email)
        console.log('Lead Qualified:', leadData);
        
        setTimeout(function() {
            addMessage("This is a demo. In the real version, this lead info would be sent directly to the agent's CRM or email. 🚀", 'bot');
        }, 2000);
    }, 1000);
}

// Start conversation when page loads
window.addEventListener('load', function() {
    setTimeout(function() {
        if (conversationStep === 0) {
            askQuestion(0);
        }
    }, 500);
});
