import json

transcript_path = '/Users/rohanughade/.gemini/antigravity/brain/7ccd3801-9bf5-4786-9c8f-a9fc8f9a6427/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r') as f:
    lines = f.readlines()

latest_user_input = ""
for line in reversed(lines):
    data = json.loads(line)
    if data.get('type') == 'USER_INPUT':
        latest_user_input = data.get('content', '')
        break

print(repr(latest_user_input[:200]))
print("...")
print(repr(latest_user_input[-200:]))
