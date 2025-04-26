import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import { transporter } from "../config/nodemailer.config.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      rollNo,
      course,
      semester,
      city,
      college,
    } = req.body;
    if (
      !(
        username ||
        email ||
        password ||
        rollNo ||
        course ||
        semester ||
        city ||
        college
      )
    ) {
      return res
        .status(201)
        .json({ success: false, message: "all fields required" });
    }
    const isUserExists = await userModel.findOne({ username });
    if (isUserExists) {
      return res
        .status(202)
        .json({ success: false, message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = userModel({
      username,
      email,
      password: hashedPassword,
      rollNo,
      course,
      semester,
      city,
      college,
    });

    await data.save();
    console.log("data saved successfully");
    try {
      const token = jwt.sign({ userId: data._id,isVerified:data.isVerified }, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS, false in development
        sameSite: "None" ,// Helps with CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    } catch (error) {
      console.log("error in sending email", error);
    }
    res.status(200).json({
      success: true,
      message: "data saved successfully",
      data,
    });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(201)
      .json({ success: false, message: "Please enter all details" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(201)
        .json({ success: false, message: "User Not Found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(201)
        .json({ success: false, message: "Invalid Credentials" });
    }
    if (!user.isVerified) {
      return res
        .status(201)
        .json({ success: false, message: "Verify your email first" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure only in production
      sameSite: "None", // Helps with CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const sendEmailOtp = async (req, res) => {
  const { userId } = req.user;

  try {
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a user ID" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    const sendEmailOptions = {
      from: `Spc Degree College <${process.env.SMTP_EMAIL}>`,
      to: user.email,
      subject: "Your One-Time Password (OTP) for Verification",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #004aad; text-align: center;">SPC Degree College</h2>
                <p>Dear ${user.name || "Student"},</p>
                <p>We received a request to verify your identity. Please use the following One-Time Password (OTP) to complete the process:</p>
                
                <div style="background-color: #f2f2f2; padding: 15px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                    ${otp}
                </div>
        
                <p style="margin-top: 20px;">This OTP is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
        
                <p>If you did not initiate this request, please ignore this email.</p>
        
                <br/>
                <p>Regards,<br/>SPC Degree College, Baghpat</p>
            </div>
            `,
    };

    await transporter.sendMail(sendEmailOptions);
    console.log("Email sent successfully");

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const verifyEmailOtp = async (req, res) => {
  const { otp } = req.body;
  const { userId } = req.user;
  try {
    if (!userId || !otp) {
      return res
        .status(500)
        .json({ success: false, message: "Provide all details" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.status(404).json({ success: false, message: "otp expired" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(404).json({ success: false, message: "invalid otp" });
    }
    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiresAt = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "email verified successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const resetOtpSend = async (req, res) => {
  const { userId } = req.user;
  const { email } = req.body;

  if (!userId && !email) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a email" });
  }
  try {
    const user = !email
      ? await userModel.findById(userId)
      : await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    const sendEmailOptions = {
      from: `Spc Degree College <${process.env.SMTP_EMAIL}>`,
      to: user.email,
      subject: "Reset Your Password - One-Time Password (OTP)",
      text: `Hello ${
        user.name || "Student"
      },\n\nWe received a request to reset your password. Use the OTP below to proceed:\n\nOTP: ${otp}\n\nThis code will expire in 5 minutes. If you did not request this, please ignore this email.\n\nRegards,\nSPC Degree College, Baghpat`,
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #004aad; text-align: center;">SPC Degree College</h2>
                <p>Dear ${user.name || "Student"},</p>
                <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to continue the reset process:</p>
                
                <div style="background-color: #f2f2f2; padding: 15px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                    ${otp}
                </div>
        
                <p style="margin-top: 20px;">This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
        
                <p>If you did not initiate this request, you can safely ignore this email and your password will remain unchanged.</p>
        
                <br/>
                <p>Regards,<br/>SPC Degree College, Baghpat</p>
            </div>
            `,
    };

    await transporter.sendMail(sendEmailOptions);
    console.log("Email sent successfully");

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const verifyResetOtp = async (req, res) => {
  const { email, otp, password } = req.body;
  const { userId } = req.user;
  if (!userId && !email) {
    return res
      .status(201)
      .json({ success: false, message: "please Provide email" });
  }
  try {
    if (!email || !otp || !password) {
      return res
        .status(500)
        .json({ success: false, message: "Provide all details" });
    }
    const user = !email
      ? await userModel.findById(userId)
      : await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.status(404).json({ success: false, message: "otp expired" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(404).json({ success: false, message: "invalid otp" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.verifyOtp = "";
    user.verifyOtpExpiresAt = undefined;
    user.password = hashedPassword;

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const isValidUser = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "User is authentacited" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
