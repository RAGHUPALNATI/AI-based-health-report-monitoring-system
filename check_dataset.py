from datasets import load_dataset
import os

os.environ["HF_HUB_DISABLE_TRUST_REMOTE_CODE"] = "0"

try:
    print("Attempting to load bigbio/bc5cdr with config 'bc5cdr_source'...")
    # Using the name 'bigbio/bc5cdr' directly often requires the config
    ds = load_dataset('bigbio/bc5cdr', 'bc5cdr_source', split='train[:1]', trust_remote_code=True)
    example = ds[0]
    print("Successfully loaded.")
    print("\nExample keys:", list(example.keys()))
    if 'passages' in example:
        print("passages[0] keys:", list(example['passages'][0].keys()))
        if len(example['passages'][0]['entities']) > 0:
            print("passages[0]['entities'][0] keys:", list(example['passages'][0]['entities'][0].keys()))
except Exception as e:
    print(f"Failed: {e}")

