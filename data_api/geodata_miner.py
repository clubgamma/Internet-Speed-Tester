import geopandas as gp
import requests
import zipfile
import os
import pandas as pd

# Function to download and extract the Indian districts shapefile
def download_and_extract_districts():
    district_zip_url = "https://geodata.ucdavis.edu/diva/adm/IND_adm.zip"
    district_zip_path = "IND_adm.zip"
    district_extract_folder = "indian_districts_data"
    
    # Check if the Indian districts zip file already exists
    if not os.path.exists(district_zip_path):
        response = requests.get(district_zip_url)
        with open(district_zip_path, 'wb') as f:
            f.write(response.content)

    # Extract the Indian districts zip file
    if not os.path.exists(district_extract_folder):
        with zipfile.ZipFile(district_zip_path, 'r') as zip_ref:
            zip_ref.extractall(district_extract_folder)

# Function to load Indian districts shapefile and combine all levels
def load_combined_indian_districts(shapefile_paths: list):
    district_gdfs = []
    
    for shapefile_path in shapefile_paths:
        if os.path.exists(shapefile_path):
            gdf = gp.read_file(shapefile_path)
            district_gdfs.append(gdf)
    
    # Combine all the GeoDataFrames into one
    combined_districts = gp.GeoDataFrame(pd.concat(district_gdfs, ignore_index=True))
    return combined_districts

# Main function to save combined districts data
def save_combined_districts_to_file():
    # Download and extract districts data
    download_and_extract_districts()
    
    # Define paths for all administrative levels (0, 1, 2, 3)
    district_shapefile_paths = [
        'indian_districts_data/IND_adm0.shp',
        'indian_districts_data/IND_adm1.shp',
        'indian_districts_data/IND_adm2.shp',
        'indian_districts_data/IND_adm3.shp'
    ]

    # Load combined districts
    combined_districts = load_combined_indian_districts(district_shapefile_paths)

    # Save to JSON
    json_output_path = 'combined_districts.json'
    combined_districts.to_file(json_output_path, driver='GeoJSON')

    # Save to CSV (removing geometry for CSV export)
    csv_output_path = 'combined_districts.csv'
    combined_districts.drop(columns='geometry').to_csv(csv_output_path, index=False)

    print(f"Combined districts saved to {json_output_path} and {csv_output_path}")

if __name__ == "__main__":
    save_combined_districts_to_file()
