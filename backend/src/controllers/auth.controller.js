import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    });

    if (isUserAlreadyExists) {
        return res.status(409).json({
            success: false,
            message: "User with this email or username already exists",
            err: "User already exists"
        });
    }

    const user = await userModel.create({username, email, password})

    const emailverificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET);

    await sendEmail({
        to: email,
        subject: "Welcome to GyanAI",
        html: `<p>Hi! ${username},</p>
        <p>Thank you for registering with us. We're excited to have you on board!</p>
        <p>Plese verify your email by clicking the link below:</p>
        <button style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px; border: none; cursor: pointer;">
            <a href="https://nexa-ai-odre.vercel.app/api/auth/verify-email?token=${emailverificationToken}" style="color: white; text-decoration: none;">Verify Email</a>
        </button>
        <p>Feel free to explore our platform and let us know if you have any questions.</p>
        <p>Best regards,<br/>The GyanAI Team</p>
        `  
    })

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
  
}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Invalid email or password",
            err: "User not found"
        });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
            err: "Invalid email or password"
        });
    }

    if (!user.verified) {
        return res.status(403).json({
            success: false,
            message: "Email not verified. Please verify your email before logging in.",
            err: "Email not verified"
        });
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });

}

export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            err: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user
    });

}

export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                err: "User not found"
            });
        }

        user.verified = true;
        await user.save();

        const html = `<h1>Email Verified Successfully!</h1> 
        <p>Your email has been verified. You can now log in to your account.</p> 
        <a href="https://nexa-ai-chatgpt.vercel.app/login">Go to Login</a>`

        res.status(200).send(html);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired token",
            err: "Invalid or expired token"
        });
    }
}