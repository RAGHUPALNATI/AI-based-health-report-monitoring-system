import os
from app import app
import json

classifier_path = "models/report_classifier.joblib"
ner_config_path = "models/ner_model/config.cfg"

classifier_exists = os.path.exists(classifier_path)
ner_config_exists = os.path.exists(ner_config_path)

print(f"Local Classifier Joblib Exists: {classifier_exists}")
print(f"Local NER Config Exists: {ner_config_exists}")

with app.test_client() as client:
    payload = {
        'report_text': 'Patient has high blood pressure 150/95, glucose 240, and low hemoglobin.',
        'values': {'glucose': 240}
    }
    response = client.post('/analyze', json=payload)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.get_json()
        classification = data.get('classification', {})
        print(f"Classification Label: {classification.get('label')}")
        print(f"Classification Confidence: {classification.get('confidence')}")
        print(f"Entities Count: {len(data.get('entities', []))}")
        print(f"Alert Flags Count: {len(data.get('alert_flags', []))}")
        # print(f"Alert Flags: {data.get('alert_flags')}")
    else:
        print(f"Error Response: {response.data.decode()}")
