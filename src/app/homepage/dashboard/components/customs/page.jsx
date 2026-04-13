// Custom Drug Search page

"use client";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, Typography, IconButton, Paper, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import axios from "axios";

export default function customs() {
  const [formData, setFormData] = useState({
    drugName: "",
    alias: "",
    category: "",
    dosageForm: "",
    effect: "",
    keywords: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [aiError, setAiError] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);

  
  const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId =
        crypto && crypto.randomUUID
          ? crypto.randomUUID()
          : `guest-${Date.now()}`;
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  const handleWishlistToggle = async (drugId) => {
    const guestId = getGuestId();

    if (wishlistIds.includes(drugId)) {
      setWishlistIds((prev) => prev.filter((id) => id !== drugId));
    } else {
      setWishlistIds((prev) => [...prev, drugId]);
    }

    try {
      await axios.post("http://localhost:5000/api/wishlist/guest/toggle", {
        guestId,
        drugId,
      });
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      // Re-sync from server if toggle fails after optimistic UI update.
      const res = await axios.get(
        "http://localhost:5000/api/wishlist/guest/ids",
        {
          params: { guestId },
        },
      );
      setWishlistIds(res.data.wishlistIds || []);
    }
  };

  useEffect(() => {
    const fetchGuestWishlistIds = async () => {
      try {
        const guestId = getGuestId();
        const response = await axios.get(
          "http://localhost:5000/api/wishlist/guest/ids",
          {
            params: { guestId },
          },
        );
        setWishlistIds(response.data.wishlistIds || []);
      } catch (err) {
        console.error("Fetch wishlist IDs error:", err);
      }
    };

    fetchGuestWishlistIds();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target; // Extracts which box was typed in and what was typed
    setFormData((prev) => ({
      ...prev, // 1. Keep all the other values exactly as they were
      [name]: value, // 2. ONLY update the one that just changed
    }));
  };

  const handleSearch = async (pageNum = 1) => {
    setSearchLoading(true);
    setError(null);
    setPage(pageNum);

    try {
      // Form data keys mapped to API expected parameters (based on db schema seen in drugsearchingforum)
      const paramMapping = {
        drugName: "Drug Name",
        alias: "Alias name",
        category: "Category",
        dosageForm: "Dosage Form",
        effect: "Effect Description",
      };

      // to filter out any empty input fields ( if input is set for alias but not other then we
      // only want to send alias as search param, not empty params for drugName, category etc
      // which might mess up searching if backend doesn't handle empty params well)
      const searchParams = Object.entries(formData)
        .filter(([_, value]) => value !== "")
        .reduce((acc, [key, value]) => {
          const apiParamKey = paramMapping[key] || key;
          return { ...acc, [apiParamKey]: value };
        }, {});

      // This stops the function early if the user clicks "Search" without typing anything.
      // It prevents your backend from trying to fetch "nothing."
      if (Object.keys(searchParams).length === 0) {
        setResults([]);
        setSearchLoading(false);
        return;
      }

      // We add page and limit to searchParams for pagination, and pass everything in `searchParams`
      // which we will stringify as a generic 'customSearch' to bypass simple generic searching if the backend supports it.
      // We also just pass the individual params as regular Axios query parameters like we did before.
      const queryParams = {
        page: pageNum,
        limit: 10,
        ...searchParams, // send standard params so backend filters them properly
      };

      const response = await axios.get("http://localhost:5000/api/drugs", {
        params: queryParams,
      });

      // Based on drugsearchingforum, the list is usually in response.data.drugs
      setResults(response.data.drugs || response.data); // it saves the list of drugs into your results state so they appear in your table
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      } else if (response.data.totalDrugs) {
        setTotalPages(Math.ceil(response.data.totalDrugs / 10));
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(
        err.message || "An error occurred while searching. Please try again.",
      );
    } finally {
      setSearchLoading(false);
    }
  };

  {
    /* The rest of the code is mostly UI rendering logic, including the search form, results display, and AI consultation section. It also includes error handling and pagination controls. 
    The handleWishlistToggle function allows users to add/remove drugs from their wishlist directly from the search results. */
  }
  const [illness, setIllness] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const handleConsult = async () => {
    const cleanedIllness = illness.trim();
    if (!cleanedIllness) {
      setAiError("Please describe your symptoms before analyzing.");
      return;
    }

    setAiLoading(true);
    setAiError("");
    try {
      // Calling the route you just added to server.js
      const res = await axios.post("http://localhost:5000/api/ai/consult", {
        userIllness: cleanedIllness,
      });
      setAiResponse(res.data.advice);
    } catch (err) {
      setAiResponse("");
      setAiError(
        "Sorry, I'm having trouble connecting to the AI consultant right now.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          bgcolor: "#f5f5f5",
          borderRadius: 4,
          m: 5,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Custom Search
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter specific drug attributes to find the perfect match for your
          needs.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            mb: 4,
            mt: 4,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              name="drugName"
              value={formData.drugName}
              onChange={handleChange}
              label="Drug name"
              variant="outlined"
            />
            <TextField
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              label="Alias"
              variant="outlined"
            />
            <TextField
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              name="dosageForm"
              value={formData.dosageForm}
              onChange={handleChange}
              label="Dosage form"
              variant="outlined"
            />
            <TextField
              name="effect"
              value={formData.effect}
              onChange={handleChange}
              label="Effect"
              variant="outlined"
            />
            <TextField
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              label="Keywords"
              variant="outlined"
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant="contained"
            onClick={() => handleSearch(1)}
            startIcon={
              searchLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SearchIcon />
              )
            }
            size="large"
            sx={{ px: 4, py: 1 }}
            disabled={searchLoading}
          >
            {searchLoading ? "Searching..." : "Search"}
          </Button>
        </Box>

        {/* AI consultant (Groq-backed) */}
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 2, mt: 4, bgcolor: "#fafafa" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AutoAwesomeIcon sx={{ color: "#1976d2", mr: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              Smart Symptom Assistant
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Describe how you are feeling, and I will search our inventory for
            matching treatments.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="e.g., I have a sharp headache and a blocked nose..."
            value={illness}
            onChange={(e) => setIllness(e.target.value)}
            sx={{ mb: 2, bgcolor: "white" }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleConsult}
            disabled={aiLoading}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            {aiLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Analyze Symptoms"
            )}
          </Button>

          {aiError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {aiError}
            </Alert>
          )}

          {aiResponse && (
            <Box
              sx={{
                mt: 4,
                p: 2,
                borderLeft: "4px solid #1976d2",
                bgcolor: "#e3f2fd",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Suggested Treatments:
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {aiResponse}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="caption"
                color="error"
                sx={{ fontWeight: "bold" }}
              >
                DISCLAIMER: This is an AI suggestion. Please consult a
                registered pharmacist or doctor.
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Basic Error Handling & Results Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 3, width: "100%", maxWidth: 600 }}>
            {error}
          </Alert>
        )}

        {results && (
          <Box sx={{ mt: 4, width: "100%", maxWidth: 800 }}>
            <Typography variant="h6" gutterBottom>
              {results.length > 0 ? "Search Results" : "Empty"}
            </Typography>
            {results.length > 0 ? (
              <>
                {results.map((item, index) => (
                  <Box
                    key={item._id || index}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: "1px solid #ccc",
                      borderRadius: 1,
                      bgcolor: "white",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1">
                        <strong>
                          {item["Drug Name"] || item.drugName || "Unnamed Drug"}
                        </strong>
                      </Typography>
                      {item._id && (
                        <IconButton
                          onClick={() => handleWishlistToggle(item._id)}
                        >
                          {wishlistIds.includes(item._id) ? (
                            <FavoriteIcon sx={{ color: "red" }} />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Category:</strong>{" "}
                      {item.Category || item.category}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Alias:</strong> {item["Alias name"] || item.alias}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Dosage Form:</strong>{" "}
                      {item["Dosage Form"] || item.dosageForm}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Effect:</strong>{" "}
                      {item["Effect Description"] || item.effect}
                    </Typography>
                  </Box>
                ))}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => handleSearch(page - 1)}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <Typography sx={{ alignSelf: "center" }}>
                      Page {page} of {totalPages}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleSearch(page + 1)}
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body2">
                No results found for your search.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
