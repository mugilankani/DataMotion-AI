#!/bin/bash
set -e

# Export data from Prisma to JSON
echo "🔄 Exporting project data..."
node exportData.js

# Check if data export was successful
if [ ! -f "./graph-output.json" ]; then
    echo "❌ Data export failed - video-data.json not found"
    exit 1
fi

cd my-video

# Render the video directly with all parameters
echo "🎥 Rendering video..."
npx remotion render \
    Chart \
    --codec=h264 \
    --fps=30 \
    --image-format=jpeg \
    --jpeg-quality=80 \
    --frames=0-149 \
    --durationInFrames=150 \
    --output="output/video.mp4"

echo "✨ Video generation complete!"

echo "📤 Uploading to R2..."
cd ..
node uploadToR2.js

echo "🎉 Process complete!"

sleep 10s