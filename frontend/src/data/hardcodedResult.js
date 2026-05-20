const hardcodedResult = {
  classification: { prediction: 'warning', confidence: 0.91 },
  summary: {
    en: 'High glucose and HbA1c indicate likely uncontrolled diabetes. Blood pressure 150/95 mmHg suggests hypertension risk. Low hemoglobin (8.9 g/dL) indicates possible anemia. Elevated cholesterol (245 mg/dL) increases cardiovascular risk. Recommend clinical follow-up and management.',
    hi: 'रोगी में उच्च ग्लूकोज़ और HbA1c स्तर होने से नियंत्रित नहीं किया गया मधुमेह संदेह है। रक्तचाप 150/95 mmHg उच्च रक्तचाप का संकेत देता है। हीमोग्लोबिन 8.9 g/dL से एनीमिया की संभावना है। कोलेस्ट्रॉल 245 mg/dL हृदय रोग का जोखिम बढ़ाता है।'
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
