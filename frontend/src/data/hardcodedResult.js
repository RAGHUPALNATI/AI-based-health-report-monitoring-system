const hardcodedResult = {
  classification: { prediction: 'warning', confidence: 0.91 },
  summary: {
    en: 'High glucose and HbA1c indicate likely uncontrolled diabetes. Blood pressure 150/95 mmHg suggests hypertension risk. Low hemoglobin (8.9 g/dL) indicates possible anemia. Elevated cholesterol (245 mg/dL) increases cardiovascular risk. Recommend clinical follow-up and management.',
    hi: 'रोगी में उच्च ग्लूकोज़ और HbA1c स्तर होने से नियंत्रित नहीं किया गया मधुमेह संदेह है। रक्तचाप 150/95 mmHg उच्च रक्तचाप का संकेत देता है। हीमोग्लोबिन 8.9 g/dL से एनीमिया की संभावना है। कोलेस्ट्रॉल 245 mg/dL हृदय रोग का जोखिम बढ़ाता है।',
    kn: 'ರೋಗಿಯ ಹೆಚ್ಚಿನ ಗ್ಲುಕೋಸ್ ಮತ್ತು HbA1c ಮಟ್ಟವು ನಿಯಂತ್ರಿತವಲ್ಲದ ಮಧುಮೇಹದ ಸೂಚನೆ ನೀಡುತ್ತದೆ. ರಕ್ತದೊತ್ತಡ 150/95 mmHg ಹೆಚ್ಚಿನ ರಕ್ತದೊತ್ತಡದ ಅಪಾಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಹೆಮೋಗ್ಲೋಬಿನ್ 8.9 g/dL ರಕ್ತಹೀನತೆಯ ಸಂಭಾವ್ಯತೆ ಸೂಚಿಸುತ್ತದೆ. ಹೆಚ್ಚಿದ ಕೊಲೆಸ್ಟ್ರಾಲ್ 245 mg/dL ಹೃದಯರೋಗದ ಅಪಾಯವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
    te: 'రోగిలో అధిక గ్లూకోజ్ మరియు HbA1c స్థాయిలు నియంత్రించబడని మధుమేహ సూచన ఇస్తాయి. రక్త పీడనం 150/95 mmHg అధిక రక్త పీడనం ప్రమాదాన్ని సూచిస్తుంది. హిమోగ్లోబిన్ 8.9 g/dL సంభావ్య అరक్తత సూచిస్తుంది. ఎలిവేటెడ్ కొలెస్ట్రాల్ 245 mg/dL హృదయ రోగ ప్రమాదాన్ని పెంచుతుంది.'
  },
  entities: [
    { text: 'Diabetes', label: 'CONDITION' },
    { text: 'Hypertension', label: 'CONDITION' },
    { text: 'Anemia', label: 'CONDITION' },
    { text: 'Cholesterol', label: 'METRIC' },
    { text: 'Glucose', label: 'METRIC' },
    { text: 'Hemoglobin', label: 'METRIC' }
  ],
  alerts: [
    'Blood glucose critically elevated — 238 mg/dL',
    'HbA1c high — 8.2%',
    'Systolic BP high — 150 mmHg',
    'Diastolic BP high — 95 mmHg',
    'Hemoglobin below normal — 8.9 g/dL',
    'Cholesterol elevated — 245 mg/dL'
  ],
  alert_flags: [
    { metric: 'systolic_bp', value: 150, threshold: 140, triggered: true },
    { metric: 'diastolic_bp', value: 95, threshold: 90, triggered: true },
    { metric: 'glucose', value: 238, threshold: 110, triggered: true },
    { metric: 'cholesterol', value: 245, threshold: 200, triggered: true },
    { metric: 'hemoglobin', value: 8.9, threshold: 13, triggered: true }
  ],
  health_score: 68
}

export default hardcodedResult
