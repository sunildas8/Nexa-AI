import { MESSAGE_ROLES } from '../config/chatConfig';

/**
 * Generate unique message ID
 */
export const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format timestamp to readable format
 */
export const formatTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Create a message object
 */
export const createMessage = (content, role) => {
  return {
    id: generateMessageId(),
    content,
    role,
    createdAt: new Date(),
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Generate mock AI response (for testing)
 */
export const generateMockResponse = (userMessage) => {
  const responses = {
    cybercrime: `Cybercrime is a vast field encompassing various illegal activities conducted via digital means. It is generally categorized into three main types based on the target:

# I. Crimes Targeting Individuals
These involve distributing malicious information or gathering personal data online. Examples include phishing, identity theft, cyberstalking, and distributing illicit content.

# II. Property Crimes
Similar to physical property crimes but in the digital realm. This includes hacking to steal sensitive company data, intellectual property theft, malware attacks (like ransomware), and DDoS attacks aimed at disrupting services.

# III. Government Crimes
Also known as cyber terrorism, these are highly coordinated attacks targeting government infrastructure, military systems, or attempting to compromise national security through espionage or data breaches.`,

    python: `Python is a high-level, interpreted programming language known for its simplicity and readability. Here are key features:

# Syntax
- Clean, intuitive syntax that resembles natural language
- Indentation-based (no curly braces needed)

# Key Features
- **Dynamic typing**: No need to declare variable types
- **Extensive libraries**: NumPy, Pandas, Django, Flask, etc.
- **Cross-platform**: Runs on Windows, Mac, Linux

# Popular Use Cases
- Web development (Django, Flask)
- Data science and machine learning (TensorFlow, PyTorch)
- Automation and scripting
- Scientific computing`,

    marketing: `Marketing is the process of promoting and selling products or services. Key strategies include:

# Digital Marketing
- SEO optimization for search visibility
- Social media marketing across platforms
- Email marketing campaigns
- Content marketing through blogs and videos

# Traditional Marketing
- Print advertising
- TV and radio commercials
- Billboard advertisements
- Direct mail campaigns

# Key Metrics
- **ROI**: Return on investment
- **CTR**: Click-through rate
- **Conversion rate**: Percentage of visitors who take desired action`,

    email: `Certainly! Here's a professional email template:

---

**Subject: Project Delay Notification**

Dear [Client Name],

I hope this email finds you well. I wanted to reach out regarding the [project name] timeline.

Due to [specific reason], we anticipate a delay in delivering the project. The revised completion date is now [new date], which is [X days/weeks] later than originally planned.

We understand this may impact your schedule, and we sincerely apologize for any inconvenience. We're committed to ensuring quality and will work diligently to meet the new deadline.

Please let me know if you'd like to discuss this further or if you have any concerns.

Best regards,
[Your Name]`,

    default: `That's an interesting question! I'm Nexa AI, an intelligent assistant here to help you with a wide range of topics including writing, analysis, coding, research, and much more.

Feel free to ask me anything - whether you need help drafting content, understanding complex concepts, or brainstorming ideas. I'll do my best to provide helpful and accurate information!

Is there something specific you'd like help with?`,
  };

  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('cybercrime')) return responses.cybercrime;
  if (lowerMessage.includes('python') && !lowerMessage.includes('programming')) return responses.python;
  if (lowerMessage.includes('python')) return responses.python;
  if (lowerMessage.includes('market') || lowerMessage.includes('marketing')) return responses.marketing;
  if (lowerMessage.includes('email') || lowerMessage.includes('draft')) return responses.email;

  return responses.default;
};

export default {
  generateMessageId,
  formatTime,
  createMessage,
  copyToClipboard,
  generateMockResponse,
};
