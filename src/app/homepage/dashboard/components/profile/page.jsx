"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Avatar, Button, TextField, IconButton, InputAdornment, Paper } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



export default function profile() {
  const router = useRouter();
  const [userId, setUserId] = useState("");

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    password: "",
    oldPassword: "",
    newPassword: "", //  new field
    mobile: "",
    address: "",
    gender: "",
    profile_pic: null,
  });
  const [previewPic, setPreviewPic] = useState(null);
  //const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      const storedUserId = localStorage.getItem("userId");
      const token = localStorage.getItem("token"); //  get JWT
      if (!storedUserId || !token) {
        router.push("/login");
        return;
      }

      setUserId(storedUserId);

      const res = await fetch(`http://localhost:5000/api/users/${storedUserId}`, {
        headers: { Authorization: `Bearer ${token}` }, // attach JWT
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to load profile.");
        return;
      }

      // Don't load the hashed password into the form
      setProfile({
        username: data.username || "",
        email: data.email || "",
        password: "", // Keep password field empty for security
        oldPassword: "",
        newPassword: "",
        mobile: data.mobile || "",
        address: data.address || "",
        gender: data.gender || "",
        profile_pic: data.profile_pic,
      });
      setPreviewPic(
        data.profile_pic ? `http://localhost:5000${data.profile_pic}` : null
      );
    };
    fetchProfile();
  }, [router]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile({ ...profile, profile_pic: file });
    setPreviewPic(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      if (!userId) {
        alert("User session not found. Please log in again.");
        return;
      }

      //  If the user entered a new password, handle it via secure password update route
      if (profile.newPassword && profile.newPassword.trim() !== "") {
        const res = await fetch(`http://localhost:5000/api/users/${userId}/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, //  attach JWT
          },
          body: JSON.stringify({
            oldPassword: profile.oldPassword, //  old password for verification
            newPassword: profile.newPassword, //  new password to hash,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Failed to update password.");
          return; // stop here if password update fails
        }
        alert("Password updated successfully!");
      }

      //  Continue saving other profile data
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("email", profile.email);
      formData.append("mobile", profile.mobile);
      formData.append("address", profile.address);
      formData.append("gender", profile.gender);

      //  Only append profile picture if it's a file
      if (profile.profile_pic instanceof File) {
        formData.append("profile_pic", profile.profile_pic);
      }

      //  Send updated info to backend
      const res2 = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ⭐ attach JWT
        },
      });

      const data2 = await res2.json();
      alert(data2.message);

      //  Update preview if new pic uploaded
      if (data2.profile_pic_url) {
        setPreviewPic(`http://localhost:5000${data2.profile_pic_url}`);
        setProfile(prev => ({ ...prev, profile_pic: data2.profile_pic_url }));
      }

    } catch (error) {
      console.error("Save error:", error);
      alert("⚠️ Something went wrong while saving profile.");
    }
  };



  //  Logout function
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    router.push("/login"); // redirect to login page
  };

  //  Delete account
  const handleDelete = async () => {
    if (!userId) {
      alert("User session not found. Please log in again.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // attach JWT
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Account deleted successfully");
        // Remove user session and redirect
        handleLogout();
      } else {
        alert(data.error || "Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting account");
    }
  };


  return (
    <Box>
      <Box sx={{ width: "100%", zIndex: 1, position: "relative" }}>
        {/* Main Content Area */}
        <Box sx={{ mt: 5, pl: 5, pr: 5, pb: 6, width: "100%", mx: "auto" }}>
          <Paper sx={{ display: "flex", borderRadius: 4, backgroundColor: "#f5f5f5", width: "auto", mx: "auto", pt: 2, pb: 4, backdropFilter: "blur(5px)", boxShadow: "none" }}>
            {/* Edit Profile Section */}
            <Box sx={{ width: "100%", mt: 5, display: "flex", justifyContent: "center" }}>
              <Paper sx={{ width: { xs: "90%", sm: "50%", md: "50%", lg: "50%", xl: "50%" }, p: 1, borderRadius: 3, boxShadow: "none", background: "transparent" }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ fontSize: { xs: 16, sm: 24, md: 24, lg: 24, xl: 24 }, mb: 2 }}>
                  Edit Profile
                </Typography>
                {/* Profile Picture */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                  <Avatar
                    src={previewPic || ""}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Button variant="contained" component="label" sx={{ fontSize: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 }, textTransform: "none", boxShadow: "none" }}>
                      Change Picture
                      <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                  </Box>
                </Box>
                {/* Inputs */}
                <TextField label="Username" name="username" fullWidth margin="normal"
                  value={profile.username || ""} onChange={handleChange}
                  autoComplete="username" // * ADDED
                  sx={{
                    "& .MuiInputBase-root": {
                      height: { xs: 45 },     // control height
                      fontSize: { xs: 12, sm: 15, md: 15, lg: 15, xl: 15 },   // font size
                      padding: { xs: "0 10px" }, // inner padding
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: 13, sm: 15, md: 15, lg: 15, xl: 15 },
                    },
                  }}
                />

                <TextField label="Email" name="email" type="email" fullWidth margin="normal"
                  value={profile.email || ""} onChange={handleChange}
                  autoComplete="email" // * ADDED
                  sx={{
                    "& .MuiInputBase-root": {
                      height: { xs: 45 },     // control height
                      fontSize: { xs: 12, sm: 15, md: 15, lg: 15, xl: 15 },   // font size
                      padding: { xs: "0 10px" }, // inner padding
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: 13, sm: 15, md: 15, lg: 15, xl: 15 },
                    },
                  }}
                />

                {/* Old Password */}
                <TextField
                  label="Old Password"
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  value={profile.oldPassword || ""}
                  onChange={handleChange}
                  autoComplete="current-password" // * ADDED
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: { xs: 45 },     // control height
                      fontSize: { xs: 12, sm: 15, md: 15, lg: 15, xl: 15 },   // font size
                      padding: { xs: "0 10px" }, // inner padding
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: 13, sm: 15, md: 15, lg: 15, xl: 15 },
                    },
                  }}
                />

                {/*  New Password */}
                <TextField
                  label="New Password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  value={profile.newPassword || ""}
                  onChange={handleChange}
                  autoComplete="new-password" // * ADDED
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: { xs: 45 },     // control height
                      fontSize: { xs: 12, sm: 15, md: 15, lg: 15, xl: 15 },   // font size
                      padding: { xs: "0 10px" }, // inner padding
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: 13, sm: 15, md: 15, lg: 15, xl: 15 },
                    },
                  }}
                />
                <TextField label="Mobile" name="mobile" fullWidth margin="normal"
                  value={profile.mobile || ""} onChange={handleChange}
                  autoComplete="tel" // * ADDED
                  sx={{
                    "& .MuiInputBase-root": {
                      height: { xs: 45 },     // control height
                      fontSize: { xs: 12, sm: 15, md: 15, lg: 15, xl: 15 },   // font size
                      padding: { xs: "0 10px" }, // inner padding
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: 13, sm: 15, md: 15, lg: 15, xl: 15 },
                    },
                  }}
                />
                <TextField label="Address" name="address" fullWidth margin="normal"
                  value={profile.address || ""} onChange={handleChange}
                  autoComplete="street-address" // * ADDED
                  sx={{
                    "& .MuiInputBase-root": {
                      height: { xs: 45 },     // control height
                      fontSize: { xs: 12, sm: 15, md: 15, lg: 15, xl: 15 },   // font size
                      padding: { xs: "0 10px" }, // inner padding
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: 13, sm: 15, md: 15, lg: 15, xl: 15 },
                    },
                  }}
                />
                {/* Action Buttons */}
                <Box sx={{ mt: 3, textAlign: "center", gap: 1, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                  {/* Save Button */}
                  <Button variant="contained" color="primary" onClick={handleSave} sx={{ fontSize: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 } }}>
                    Save Changes
                  </Button>
                  {/* Sign Out Button */}
                  <Button variant="outlined" color="error" onClick={handleLogout} sx={{ fontSize: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 } }}>
                    Sign Out
                  </Button>
                  {/* Delete Button */}
                  <Button variant="outlined" color="error" onClick={handleDelete} sx={{ fontSize: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 } }}>
                    Delete Profile
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
