import React, { createContext, useContext, useState } from "react";
import api from "../lib/axios";

const LanguageContext = createContext();

const translationDictionary = {
  // ── Crops ──────────────────────────────────────────────────────────
  "potato": "आलू", "tomato": "टमाटर", "wheat": "गेहूं", "rice": "चावल",
  "corn": "मक्का", "maize": "मक्का", "soybean": "सोयाबीन", "soybeans": "सोयाबीन",
  "cotton": "कपास", "sugarcane": "गन्ना", "onion": "प्याज", "garlic": "लहसुन",
  "brinjal": "बैंगन", "cauliflower": "फूलगोभी", "cabbage": "पत्तागोभी",
  "spinach": "पालक", "okra": "भिंडी", "mango": "आम", "banana": "केला",
  "papaya": "पपीता", "guava": "अमरूद", "lemon": "नींबू", "orange": "संतरा",
  "groundnut": "मूंगफली", "peanut": "मूंगफली", "chickpea": "चना",
  "lentil": "मसूर", "sunflower": "सूरजमुखी", "sunflowers": "सूरजमुखी",
  "barley": "जौ", "mustard": "सरसों", "potatoes": "आलू", "blueberries": "ब्लूबेरी",

  // ── Diseases ───────────────────────────────────────────────────────
  "potato early blight": "आलू का अगेती झुलसा रोग",
  "potato late blight": "आलू का पछेती झुलसा रोग",
  "potato healthy": "स्वस्थ आलू",
  "tomato late blight": "टमाटर का पछेती झुलसा रोग",
  "tomato early blight": "टमाटर का अगेती झुलसा रोग",
  "tomato healthy": "स्वस्थ टमाटर",
  "tomato leaf curl": "टमाटर पत्ता मुड़न रोग",
  "wheat healthy": "स्वस्थ गेहूं",
  "wheat rust": "गेहूं का रतुआ रोग",
  "corn healthy": "स्वस्थ मक्का",
  "corn blight": "मक्का का झुलसा रोग",

  // ── Soil Types ─────────────────────────────────────────────────────
  "loamy": "दोमट", "loam": "दोमट", "loamy soil": "दोमट मिट्टी",
  "clay": "चिकनी मिट्टी", "clay soil": "चिकनी मिट्टी",
  "sandy": "बलुई मिट्टी", "sandy soil": "बलुई मिट्टी", "sandy loam": "बलुई दोमट",
  "silty": "गाद मिट्टी", "silt": "गाद", "silty loam": "गाद दोमट",
  "black soil": "काली मिट्टी", "red soil": "लाल मिट्टी",
  "alluvial": "जलोढ़ मिट्टी", "alluvial soil": "जलोढ़ मिट्टी",
  "peat": "पीट मिट्टी", "chalky": "चाकी मिट्टी", "peaty": "पीट मिट्टी",

  // ── Soil Colors ────────────────────────────────────────────────────
  "reddish-brown": "लालिमा-भूरा", "dark brown": "गहरा भूरा",
  "light brown": "हल्का भूरा", "brown": "भूरा", "black": "काला",
  "gray": "धूसर", "grey": "धूसर", "yellowish": "पीलापन",
  "red": "लाल", "orange-brown": "नारंगी-भूरा",

  // ── pH Levels ──────────────────────────────────────────────────────
  "acidic": "अम्लीय", "highly acidic": "अत्यधिक अम्लीय",
  "slightly acidic": "थोड़ा अम्लीय", "neutral": "उदासीन",
  "alkaline": "क्षारीय", "slightly alkaline": "थोड़ा क्षारीय",
  "highly alkaline": "अत्यधिक क्षारीय",

  // ── Moisture ───────────────────────────────────────────────────────
  "dry": "सूखा", "very dry": "बहुत सूखा", "moderate": "मध्यम",
  "medium": "मध्यम", "wet": "गीला", "waterlogged": "जलभराव",

  // ── Fertility ──────────────────────────────────────────────────────
  "very high": "बहुत अधिक", "high": "अधिक", "low": "कम",
  "very low": "बहुत कम", "rich": "समृद्ध", "poor": "कम उपजाऊ",
  "very poor": "बहुत कम उपजाऊ", "excellent": "उत्कृष्ट",

  // ── Improvement Tips ───────────────────────────────────────────────
  "add organic compost": "जैविक खाद डालें",
  "use cover crops": "आवरण फसलें उगाएं",
  "reduce tillage": "जुताई कम करें",
  "add lime to reduce acidity": "अम्लता कम करने के लिए चूना डालें",
  "add sulfur to reduce alkalinity": "क्षारीयता कम करने के लिए गंधक डालें",
  "improve drainage": "जल निकासी सुधारें",
  "add organic matter": "जैविक पदार्थ मिलाएं",
  "apply mulch": "मल्च लगाएं",
  "use drip irrigation": "ड्रिप सिंचाई का उपयोग करें",
  "add gypsum": "जिप्सम डालें",
  "use green manure": "हरी खाद का उपयोग करें",
  "test soil regularly": "मिट्टी की नियमित जांच करें",
  "add compost": "खाद डालें",
  "crop rotation": "फसल चक्र अपनाएं",
  "reduce compaction": "मिट्टी का दबाव कम करें",
  "add sand to improve drainage": "जल निकासी सुधारने के लिए रेत मिलाएं",

  // ── Fertilizer ─────────────────────────────────────────────────────
  "balanced fertilizer with organic matter": "जैविक पदार्थ युक्त संतुलित उर्वरक",
  "nitrogen-rich fertilizer": "नाइट्रोजन-युक्त उर्वरक",
  "phosphorus-rich fertilizer": "फास्फोरस-युक्त उर्वरक",
  "potassium-rich fertilizer": "पोटाश-युक्त उर्वरक",
  "standard balanced fertilizer": "मानक संतुलित उर्वरक",
  "reduce nitrogen application": "नाइट्रोजन का उपयोग कम करें",
  "avoid high nitrogen fertilizers": "अत्यधिक नाइट्रोजन वाले उर्वरकों से बचें",
  "use organic compost and npk fertilizer": "जैविक खाद और एनपीके उर्वरक का उपयोग करें",
  "apply balanced npk fertilizer": "संतुलित एनपीके उर्वरक लगाएं",
  "use compost and organic fertilizers": "खाद और जैविक उर्वरकों का उपयोग करें",
  "no fertilizer needed": "किसी उर्वरक की जरूरत नहीं",
  "avoid using high-nitrogen fertilizers, which can promote leaf growth and make the plants more susceptible to disease. instead, use a balanced fertilizer with equal amounts of nitrogen, phosphorus, and potassium.": "अत्यधिक नाइट्रोजन वाले उर्वरकों का उपयोग करने से बचें। इसके बजाय, नाइट्रोजन, फास्फोरस और पोटेशियम की समान मात्रा वाले संतुलित उर्वरक का उपयोग करें।",

  // ── Irrigation ─────────────────────────────────────────────────────
  "moderate and consistent moisture levels": "मध्यम और निरंतर नमी का स्तर बनाए रखें",
  "drip irrigation recommended": "ड्रिप सिंचाई की सलाह दी जाती है",
  "avoid waterlogging": "जलभराव से बचें",
  "water regularly but avoid overwatering": "नियमित रूप से पानी दें लेकिन अधिक पानी से बचें",
  "ensure proper drainage": "उचित जल निकासी सुनिश्चित करें",
  "frequent irrigation needed": "बार-बार सिंचाई जरूरी है",
  "minimal irrigation required": "कम सिंचाई की जरूरत है",

  // ── Treatment Steps ────────────────────────────────────────────────
  "remove infected leaves immediately": "संक्रमित पत्तियों को तुरंत हटा दें",
  "apply copper-based fungicide": "तांबा आधारित कवकनाशी का छिड़काव करें",
  "improve drainage around plants": "पौधों के आसपास जल निकासी में सुधार करें",
  "remove all infected plants": "सभी संक्रमित पौधों को हटा दें",
  "apply fungicide immediately": "तुरंत कवकनाशी का छिड़काव करें",
  "avoid overhead irrigation": "ऊपर से पानी देने से बचें",
  "remove infected leaves and stems to prevent the spread of the disease": "बीमारी के प्रसार को रोकने के लिए संक्रमित पत्तियों और तनों को हटा दें",
  "improve air circulation around the plants to reduce moisture and promote drying": "नमी कम करने के लिए पौधों के आसपास हवा के संचार में सुधार करें",

  // ── Prevention ─────────────────────────────────────────────────────
  "use resistant varieties and crop rotation": "रोग प्रतिरोधी किस्मों और फसल चक्र का उपयोग करें",
  "use crop rotation and good sanitation": "फसल चक्र और अच्छी साफ-सफाई का पालन करें",
  "maintain current good practices": "वर्तमान अच्छी प्रथाओं को बनाए रखें",
  "maintain good crop rotation, remove weeds that can harbor the pathogen, and ensure adequate spacing between plants to improve air circulation.": "अच्छी फसल चक्र बनाए रखें, रोगजनक को शरण देने वाले खरपतवारों को हटा दें, और पर्याप्त दूरी सुनिश्चित करें।",

  // ── Disclaimers ────────────────────────────────────────────────────
  "model trained on lab images. real-world accuracy may vary.": "मॉडल प्रयोगशाला चित्रों पर प्रशिक्षित है। वास्तविक सटीकता भिन्न हो सकती है।",
  "model prediction results.": "मॉडल भविष्यवाणी परिणाम।",

  // ── Plant Families ─────────────────────────────────────────────────
  "solanaceae": "सोलेनेसी (नाइटशेड कुल)",
  "rosaceae": "रोसेसी (गुलाब कुल)",
  "fabaceae": "फेबेसी (फलियां कुल)",
  "poaceae": "पोएसी (घास कुल)",
  "cucurbitaceae": "कुकुरबिटेसी (लौकी कुल)",
  "rutaceae": "रुटेसी (नींबू कुल)",
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("kisanai_lang") || "en";
  });




  const setLanguage = async (newLang) => {
    setLanguageState(newLang);
    localStorage.setItem("kisanai_lang", newLang);
    const token = localStorage.getItem("kisanai_token");
    if (token) {
      try {
        // Use cached profile to avoid an extra GET call
        const cached = JSON.parse(localStorage.getItem("kisanai_profile") || "{}");
        await api.put("/auth/profile", {
          full_name: cached.full_name || "Kisan Farmer",
          preferred_language: newLang,
          farm_location: cached.farm_location || "",
          avatar_url: cached.avatar_url || ""
        });
        // Update cached profile preferred_language too
        if (cached.full_name !== undefined) {
          localStorage.setItem("kisanai_profile", JSON.stringify({ ...cached, preferred_language: newLang }));
        }
      } catch (err) {
        console.error("Failed to update language on backend:", err);
      }
    }
  };

  // Static UI label translation: t("English text", "हिन्दी अनुवाद")
  const t = (en, hi) => (language === "hi" ? hi : en);

  // Dynamic text: exact match lookup in dictionary
  const dt = (text) => {
    if (!text) return text;
    if (language !== "hi") return text;
    const key = text.trim().toLowerCase().replace(/\s+/g, " ");
    return translationDictionary[key] || text;
  };

  // Dynamic translation for API values — handles comma-separated lists and semantic phrase matching
  const tDyn = (text) => {
    if (!text) return text;
    if (language !== "hi") return text;
    const key = text.trim().toLowerCase().replace(/\s+/g, " ");
    
    // 1. Check exact match in dictionary first
    if (translationDictionary[key]) return translationDictionary[key];
    
    // 2. Comma-separated lists (like crops)
    if (text.includes(",") && !text.includes(".")) {
      return text.split(",")
        .map(w => {
          const wk = w.trim().toLowerCase();
          return translationDictionary[wk] || w.trim();
        })
        .join(", ");
    }
    
    // 3. Semantic keyword/phrase matching for treatment steps
    if (key.includes("remove infected leaves") || key.includes("remove and destroy infected leaves") || key.includes("remove infected fruit") || key.includes("remove infected fruits")) {
      return "संक्रमित पत्तियों और फलों को तुरंत हटाकर नष्ट कर दें (प्रसार रोकने के लिए)";
    }
    if (key.includes("remove all infected plants") || key.includes("remove and dispose of infected plants") || key.includes("remove infected plants") || key.includes("remove and destroy infected plants")) {
      return "सभी संक्रमित पौधों को तुरंत उखाड़कर नष्ट कर दें";
    }
    if (key.includes("fungicide containing chlorothalonil") || key.includes("fungicide containing copper") || key.includes("apply copper-based fungicide") || key.includes("apply a fungicide") || key.includes("copper oxychloride")) {
      return "कवकनाशी (तांबा या क्लोरोथैलोनिल युक्त) का छिड़काव करें";
    }
    if (key.includes("improve air circulation") || key.includes("pruning nearby vegetation") || key.includes("adequate spacing")) {
      return "पौधों के आसपास हवा के संचार में सुधार करें (छंटाई करें और उचित दूरी रखें)";
    }
    if (key.includes("disinfect tools") || key.includes("bleach solution")) {
      return "उपकरणों और औजारों को 1% या 10% ब्लीच समाधान से विसंक्रमित करें";
    }
    if (key.includes("insecticidal soap") || key.includes("neem oil") || key.includes("whiteflies") || key.includes("thrips") || key.includes("aphids")) {
      return "कीटों (सफेद मक्खी/थ्रिप्स) को नियंत्रित करने के लिए नीम तेल या कीटनाशक साबुन लगाएं";
    }
    if (key.includes("virus-free seed source") || key.includes("resistant varieties")) {
      return "रोग प्रतिरोधी किस्मों और वायरस-मुक्त प्रमाणित बीजों का उपयोग करें";
    }
    
    // 4. Semantic keyword/phrase matching for fertilizer
    if (key.includes("avoid using high-nitrogen") || key.includes("avoid high-nitrogen") || key.includes("avoid high nitrogen") || key.includes("exacerbate")) {
      return "अत्यधिक नाइट्रोजन वाले उर्वरकों से बचें, यह रोग बढ़ा सकता है; संतुलित एनपीके (NPK) खाद का उपयोग करें";
    }
    if (key.includes("maintain regular fertilization") || key.includes("balanced fertilizer")) {
      return "संतुलित एनपीके (10-10-10) उर्वरक के साथ नियमित खाद देना जारी रखें";
    }
    if (key.includes("no specific fertilizer") || key.includes("no fertilizer application")) {
      return "किसी विशिष्ट उर्वरक परिवर्तन की आवश्यकता नहीं है, संतुलित पोषण देना जारी रखें";
    }
    
    // 5. Semantic keyword/phrase matching for prevention
    if (key.includes("maintain good sanitation") || key.includes("good sanitation practices") || key.includes("removing weeds")) {
      return "खेत में अच्छी साफ-सफाई रखें, खरपतवारों और मलबे को नियमित रूप से हटाएं";
    }
    if (key.includes("crop rotation") || key.includes("rotate crops") || key.includes("disease cycle") || key.includes("break the disease")) {
      return "फसल चक्र (क्रॉप रोटेशन) अपनाएं ताकि रोग का चक्र टूट सके";
    }
    if (key.includes("avoid overhead irrigation") || key.includes("proper watering") || key.includes("irrigation practices")) {
      return "ऊपर से पानी देने (छिड़काव) से बचें ताकि पत्तियों पर अधिक नमी न रहे";
    }
    
    // 6. Disease names
    if (key.includes("tomato septoria leaf spot") || key.includes("septoria")) {
      return "टमाटर का सेप्टोरिया पत्ता धब्बा रोग (Septoria Leaf Spot)";
    }
    if (key.includes("tomato tomato mosaic virus") || key.includes("mosaic virus")) {
      return "टमाटर का मोज़ेक वायरस रोग (Tomato Mosaic Virus)";
    }
    if (key.includes("potato late blight")) {
      return "आलू का पछेती झुलसा रोग (Late Blight)";
    }
    if (key.includes("potato early blight")) {
      return "आलू का अगेती झुलसा रोग (Early Blight)";
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dt, tDyn }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
