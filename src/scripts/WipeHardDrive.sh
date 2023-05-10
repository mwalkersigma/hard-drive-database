#!/usr/bin/env bash
# WipeHardDrive.sh

temp_folder_path="/Volumes/Temp"
long_term_storage_path="/Volumes/LongTermStorage"
api_url="https://api.example.com"

# Prompt user for serial number and company name
read -r -p "Enter company name: " company_name
#killdisk

for file in "$temp_folder_path"/*; do
      # Upload file to API
      # this is how the file gets to my server
      curl -X POST -F "file=@$file" "$api_url/api/addHardDrive?company_name=$company_name&name=$file"
      # if this is doug reading this is where you would put the code to move the file to long term storage
      # and rename the file however you want
      extension="${file##*.}"
      new_filename="${company_name}_.$extension"
      mv "$file" "$long_term_storage_path/$new_filename"
done
