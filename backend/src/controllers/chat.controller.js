import { generateResponse, generateChatTitle, generateResponseStream } from "../services/ai.service.js";
import chatModel from "../model/chat.model.js";
import messageModel from "../model/message.model.js";

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                message: "Message content is required" 
            });
        }
   
        let title = null, chat = null;

        if (!chatId) {
            title = await generateChatTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title,
            })
        }

        const finalChatId = chatId || chat._id;

        const userMessage = await messageModel.create({
            chat: finalChatId,
            content: message,
            role: "user",
        })

        const messages = await messageModel.find({chat: finalChatId}).sort({ createdAt: 1 })

        // Set headers for streaming
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');

        // Send initial data (user message and chat info)
        res.write(JSON.stringify({ 
            type: 'init',
            userMessage,
            title,
            chat
        }) + '\n');

        let fullResponse = '';
        let aiMessageId = null;

        // Stream the response
        await generateResponseStream(messages, async (chunk) => {
            fullResponse += chunk;
            res.write(JSON.stringify({ 
                type: 'chunk',
                content: chunk 
            }) + '\n');
        });

        // Save the complete AI message
        const aiMessage = await messageModel.create({
            chat: finalChatId,
            content: fullResponse,
            role: "ai",
        })

        // Send completion signal
        res.write(JSON.stringify({ 
            type: 'complete',
            aiMessage
        }) + '\n');

        res.end();
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.write(JSON.stringify({ 
            type: 'error',
            message: "Error sending message",
            error: error.message 
        }) + '\n');
        res.end();
    }
}

export async function getChats(req, res) {
    const user = req.user;

    const chats = await chatModel.find({ user: user.id });
    
    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    });
}

export async function getMessages(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findById({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    });

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })
}

export async function deleteChat(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully",
    })
}