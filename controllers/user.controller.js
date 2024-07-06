import { User } from "../models/users.models.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, msg: "Email is already registered" });
    const newUser = await User.create({ name, email, password });

    const returnUser = await User.findById(newUser._id).select("-password");
    return res.status(200).json({ success: true, returnUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error("Please provide all fields");

    const user = await User.findOne({ email });

    if (!user) throw new Error("Invalid Email or Password");

    const passwordMatched = await user.checkPassword(password);
    if (!passwordMatched) throw new Error("Password is wrong");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    const returnUser = await User.findById(user._id).select("-password");
    return res
      .status(200)
      .cookie("access_token", accessToken, options)
      .cookie("refresh_token", refreshToken, options)
      .json({ returnUser, accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.accessToken = undefined;
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
  }

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ msg: "user logged out" });
};
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(500, "something went wrong");
  }
};
export { register, login, logout };
