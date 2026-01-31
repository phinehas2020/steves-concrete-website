#!/bin/bash

BASE_PATH="/Users/phinehasadams/Library/CloudStorage/OneDrive-HomesteadGristmill/My personal brand/Steve site"
OUTPUT_DIR="src/assets/images/jobs"

# Array of folders
folders=(
  "2025-01-27_Commercial_Concrete_Barrier"
  "2017-01-28_Concrete_Staining"
  "2017-02-02_Concrete_Slab_Pour"
  "2017-02-18_Construction_Site"
  "2017-03-08_Concrete_Finishing"
  "2017-03-18_Personal"
  "2017-03-28_Concrete_Slab"
  "2017-04-10_Rebar_Prep"
  "2017-04-20_Site_Excavation"
  "2017-05-01_Stained_Walkway"
  "2017-05-08_Concrete_Slab"
  "2017-06-10_Foundation_Excavation"
  "2017-07-07_Exposed_Aggregate_Patio"
  "2024-02-13_Foundation_Excavation"
  "2024-03-27_Concrete_Formwork"
  "2024-04-06_Concrete_Slab_Finishing"
  "2024-05-07_Rebar_Prep"
  "2024-06-14_Foundation_Rebar"
  "2024-06-28_Playground_Decorative_Concrete"
  "2024-08-12_Unknown_Job"
  "2024-09-07_Concrete_Forms_Prep"
  "2024-09-12_Unknown_Job"
  "2024-10-16_Stamped_Concrete_Walkway"
  "2024-11-11_Concrete_Driveway"
  "2024-08-01_Residential_Driveway"
)

for folder in "${folders[@]}"; do
  folder_path="$BASE_PATH/$folder"
  
  if [ ! -d "$folder_path" ]; then
    echo "Skipping $folder - not found"
    continue
  fi
  
  # Create slug from folder name
  slug=$(echo "$folder" | tr '[:upper:]' '[:lower:]' | tr '_' '-')
  
  # Find and copy images
  img_count=0
  for img in "$folder_path"/*; do
    if [ -f "$img" ]; then
      ext="${img##*.}"
      ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
      # Check if it's an image file
      if [[ "$ext_lower" == "jpg" ]] || [[ "$ext_lower" == "jpeg" ]] || [[ "$ext_lower" == "png" ]]; then
        img_count=$((img_count + 1))
        # Normalize extension
        if [[ "$ext_lower" == "jpg" ]]; then
          ext_lower="jpeg"
        fi
        dest="$OUTPUT_DIR/${slug}-${img_count}.${ext_lower}"
        cp "$img" "$dest"
        echo "Copied: $dest"
      fi
    fi
  done
  
  echo "Processed $folder: $img_count images"
done

echo "Done copying images!"
