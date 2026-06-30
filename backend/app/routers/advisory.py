from fastapi import APIRouter, HTTPException
from app.database import database

router = APIRouter(prefix="/api", tags=["Advisory"])

CROP_ADVISORIES_SEED = [
    {
        "crop_id": "tomato",
        "crop_name": "Tomato",
        "crop_name_hi": "टमाटर",
        "soil_prep": "Well-drained sandy loam soil with pH 6.0-7.0. Mix in 2-3 inches of aged compost or manure prior to transplanting.",
        "soil_prep_hi": "6.0-7.0 पीएच वाली अच्छी जल निकासी वाली बलुई दोमट मिट्टी। रोपाई से पहले 2-3 इंच सड़ी हुई गोबर की खाद मिलाएं।",
        "planting_time": "Autumn (September - November) and Spring (February - March).",
        "planting_time_hi": "शरद ऋतु (सितंबर - नवंबर) और वसंत ऋतु (फरवरी - मार्च)।",
        "pest_management": "Use crop rotation (avoid planting after potatoes/eggplants). Apply neem oil spray for aphids and whiteflies. Treat fungal blights with copper-based organic sprays.",
        "pest_management_hi": "फसल चक्र का प्रयोग करें। एफिड्स और सफेद मक्खियों के लिए नीम के तेल का छिड़काव करें। तांबे आधारित जैविक स्प्रे से फफूंद जनित झुलसा रोग का उपचार करें।",
        "irrigation": "Deep watering of 1-1.5 inches per week at the base of the plant. Avoid wetting leaves to prevent leaf spot diseases.",
        "irrigation_hi": "पौधे के आधार पर प्रति सप्ताह 1-1.5 इंच गहरी सिंचाई करें। पत्ती के धब्बे वाले रोगों से बचाव के लिए पत्तियों को गीला करने से बचें।"
    },
    {
        "crop_id": "potato",
        "crop_name": "Potato",
        "crop_name_hi": "आलू",
        "soil_prep": "Loose, well-drained acidic soil (pH 5.0-6.0) to prevent scab disease. Add decomposed leaf mold and organic compost.",
        "soil_prep_hi": "खुजली रोग से बचाव के लिए ढीली, अच्छी जल निकासी वाली अम्लीय मिट्टी (पीएच 5.0-6.0)। सड़ी हुई पत्तियों की खाद और जैविक खाद मिलाएं।",
        "planting_time": "Winter crop (October - November).",
        "planting_time_hi": "शीतकालीन फसल (अक्टूबर - नवंबर)।",
        "pest_management": "Always use certified disease-free seed tubers. Keep soil hilled around growing stems. Apply trichoderma formulations for root rot control.",
        "pest_management_hi": "हमेशा प्रमाणित रोगमुक्त कंदों का उपयोग करें। बढ़ते तनों के चारों ओर मिट्टी चढ़ाते रहें। जड़ सड़न नियंत्रण के लिए ट्राइकोडर्मा का प्रयोग करें।",
        "irrigation": "Provide uniform soil moisture during tuber bulking (approx every 7-10 days). Stop watering 10-14 days before harvesting to mature tuber skins.",
        "irrigation_hi": "कंद बनने के दौरान समान रूप से नमी प्रदान करें (लगभग हर 7-10 दिनों में)। कंद के छिलके को पकाने के लिए कटाई से 10-14 दिन पहले पानी देना बंद कर दें।"
    },
    {
        "crop_id": "wheat",
        "crop_name": "Wheat",
        "crop_name_hi": "गेहूं",
        "soil_prep": "Fertile clay loam or loam soils. Clear crop residues, apply balanced nitrogen, phosphate, and potash base fertilizer.",
        "soil_prep_hi": "उर्वरक चिकनी दोमट या दोमट मिट्टी। फसल के अवशेष साफ करें, संतुलित नाइट्रोजन, फास्फेट और पोटाश खाद डालें।",
        "planting_time": "Rabi Season (November - December).",
        "planting_time_hi": "रबी सीजन (नवंबर - दिसंबर)।",
        "pest_management": "Choose rust-resistant seed cultivars. Treat seeds with biological fungicides before sowing. Hand-weed during first 30 days.",
        "pest_management_hi": "गेरूआ प्रतिरोधी बीजों का चयन करें। बुवाई से पहले बीजों का जैविक कवकनाशी से उपचार करें। पहले 30 दिनों में हाथ से निराई करें।",
        "irrigation": "4-6 irrigation cycles are critical: Crown root initiation (21 days), jointing, flowering, and milk stages.",
        "irrigation_hi": "4-6 सिंचाई चक्र महत्वपूर्ण हैं: ताज जड़ दीक्षा (21 दिन), गांठें बनना, फूल आना और दूधिया अवस्था।"
    }
]

@router.get("/advisory")
async def list_advisories():
    count = await database["advisories"].count_documents({})
    if count == 0:
        await database["advisories"].insert_many(CROP_ADVISORIES_SEED)
        
    cursor = database["advisories"].find({}, {"_id": 0})
    advisories = []
    async for doc in cursor:
        advisories.append(doc)
    return advisories
