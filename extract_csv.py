transcript_full_path = "/Users/rohanughade/.gemini/antigravity/brain/7ccd3801-9bf5-4786-9c8f-a9fc8f9a6427/.system_generated/logs/transcript_full.jsonl"

with open(transcript_full_path, 'r') as f:
    text = f.read()

start_idx = text.rfind('job_id,job_title')
if start_idx != -1:
    # Find the end of the JSON string or message
    # It might be escaped with \n
    import json
    # Better approach: Read line by line, parse JSON, find the one with job_id
    with open(transcript_full_path, 'r') as f2:
        for line in reversed(f2.readlines()):
            try:
                data = json.loads(line)
                content = data.get('content', '')
                if 'job_id,job_title' in content:
                    idx = content.find('job_id,job_title')
                    csv = content[idx:]
                    import os
                    os.makedirs('backend/data', exist_ok=True)
                    with open('backend/data/jobs_dataset.csv', 'w') as out:
                        out.write(csv)
                    print(f"Extracted CSV. Lines: {len(csv.splitlines())}")
                    break
            except Exception as e:
                pass
