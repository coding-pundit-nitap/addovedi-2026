#!/bin/bash

# =======================================================
# Addovedi 3D Model Optimization Script
# Resizes textures to 512px max + converts GLTF to GLB
# =======================================================

MODELS_DIR="/Users/vivekgupta/Addovedi/addovedi-2026/client/public/models"
MAX_SIZE=512

echo "================================================"
echo " ADDOVEDI — 3D Model Optimization Pipeline"
echo " Texture max resolution: ${MAX_SIZE}px"
echo "================================================"

TEXTURE_COUNT=0

# Step 1: Resize all textures using macOS sips
echo ""
echo "[STEP 1] Resizing model textures to ${MAX_SIZE}px max..."
echo ""

for model_dir in "$MODELS_DIR"/*/; do
    model_name=$(basename "$model_dir")
    textures_dir="${model_dir}textures"
    
    if [ -d "$textures_dir" ]; then
        echo "  → Processing $model_name textures..."
        
        # Process each image file (separate loops for each extension)
        for img in "$textures_dir"/*.jpg "$textures_dir"/*.jpeg "$textures_dir"/*.png "$textures_dir"/*.JPG "$textures_dir"/*.JPEG "$textures_dir"/*.PNG; do
            [ -f "$img" ] || continue
            
            width=$(sips -g pixelWidth "$img" 2>/dev/null | awk 'NR==2{print $2}')
            
            if [ -n "$width" ] && [ "$width" -gt "$MAX_SIZE" ] 2>/dev/null; then
                height=$(sips -g pixelHeight "$img" 2>/dev/null | awk 'NR==2{print $2}')
                before=$(wc -c < "$img")
                sips --resampleHeightWidthMax $MAX_SIZE "$img" --out "$img" > /dev/null 2>&1
                after=$(wc -c < "$img")
                saved=$(( (before - after) / 1024 ))
                echo "    ✓ $(basename $img): ${width}x${height} → resized (saved ${saved}KB)"
                TEXTURE_COUNT=$((TEXTURE_COUNT + 1))
            fi
        done
    fi
done

echo ""
echo "  Resized $TEXTURE_COUNT texture files."

# Step 2: Convert all GLTF models to compressed GLB
echo ""
echo "[STEP 2] Converting GLTF → compressed GLB with Draco..."
echo ""

for gltf_file in "$MODELS_DIR"/*/scene.gltf; do
    [ -f "$gltf_file" ] || continue
    model_dir=$(dirname "$gltf_file")
    model_name=$(basename "$model_dir")
    glb_output="${model_dir}/scene.glb"
    
    echo "  → Compressing $model_name..."
    npx gltf-pipeline -i "$gltf_file" -o "$glb_output" -b -d --draco.compressionLevel 10 > /dev/null 2>&1
    
    if [ -f "$glb_output" ]; then
        glb_size=$(du -sh "$glb_output" | cut -f1)
        echo "    ✓ scene.glb created: $glb_size"
    else
        echo "    ✗ Failed for $model_name"
    fi
done

# Step 3: Summary
echo ""
echo "[STEP 3] Final model sizes:"
echo "================================================"
for glb in "$MODELS_DIR"/*/scene.glb; do
    [ -f "$glb" ] || continue
    model_name=$(basename $(dirname "$glb"))
    size=$(du -sh "$glb" | cut -f1)
    echo "  $model_name → $size"
done
echo "================================================"
echo "  OPTIMIZATION COMPLETE — Update paths to .glb!"
echo "================================================"
