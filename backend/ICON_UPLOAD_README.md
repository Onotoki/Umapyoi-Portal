Upload strategy icons to frontend public folder

Endpoint: POST /api/icons/upload

Requirements:
- Attach files in multipart form under field name `icons`.
- Filenames must match exactly: runner.png, leader.png, betweener.png, chaser.png, runaway.png

Example curl:

curl -v -X POST "http://localhost:5000/api/icons/upload" \
  -F "icons=@runner.png" \
  -F "icons=@leader.png" \
  -F "icons=@betweener.png" \
  -F "icons=@chaser.png" \
  -F "icons=@runaway.png"

On success the files are written to frontend/public/icons/strategy/
