#!/usr/bin/env bash
# WipeHardDrive.sh

temp_folder_path="/Volumes/Temp"
long_term_storage_path="/Volumes/LongTermStorage"
api_url="https://api.example.com"

# Prompt user for serial number and company name
read -r -p "Enter serial number: " serial_number
read -r -p "Enter company name: " company_name

#killdisk

for file in "$temp_folder_path"/*; do
      # Upload file to API
      curl -X POST -F "file=@$file" "$api_url/api/addHardDrive?serial_number=$serial_number&company_name=$company_name&name=$file"
      # Move file to long term storage
      extension="${file##*.}"
      new_filename="${serial_number}_${company_name}_.$extension"
      mv "$file" "$long_term_storage_path/$new_filename"
done
