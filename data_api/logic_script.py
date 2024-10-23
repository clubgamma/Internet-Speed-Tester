from datetime import datetime
from flask import Flask, jsonify, request
import geopandas as gp
import requests
from tqdm import tqdm
import zipfile
import os


# Function to calculate the start of a given quarter
def quarter_start(year: int, q: int) -> datetime:
    if not 1 <= q <= 4:
        raise ValueError("Quarter must be within [1, 2, 3, 4]")
    
    month = [1, 4, 7, 10]
    return datetime(year, month[q - 1], 1)

# Function to get the Ookla tile URL for a specific service type, year, and quarter
def get_tile_url(service_type: str, year: int, q: int) -> str:
    dt = quarter_start(year, q)

    base_url = "https://ookla-open-data.s3-us-west-2.amazonaws.com/shapefiles/performance"
    url = f"{base_url}/type%3D{service_type}/year%3D{dt:%Y}/quarter%3D{q}/{dt:%Y-%m-%d}_performance_{service_type}_tiles.zip"
    return url

# Function to download a file with a progress bar
def download_file(url: str, dest: str):
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    block_size = 1024  # 1 KiB
    t = tqdm(total=total_size, unit='iB', unit_scale=True)

    with open(dest, 'wb') as file:
        for data in response.iter_content(block_size):
            t.update(len(data))
            file.write(data)
    t.close()

    if total_size != 0 and t.n != total_size:
        print("ERROR, something went wrong")

# Function to extract a zip file to a specified directory
def extract_zip(zip_path: str, extract_to: str):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)

# Function to list all files in a directory (for debugging purposes)
def list_files(directory: str):
    for root, dirs, files in os.walk(directory):
        for file in files:
            print(os.path.join(root, file))

# Function to load Indian districts shapefile and reproject if needed
def load_indian_districts(shapefile_path: str, target_crs: str):
    districts = gp.read_file(shapefile_path)
    
    # Ensure that the CRS of the districts matches the Ookla tiles CRS
    if districts.crs != target_crs:
        districts = districts.to_crs(target_crs)
    
    return districts

# Function to perform spatial join between tiles and districts
def join_tiles_to_districts(tiles: gp.GeoDataFrame, districts: gp.GeoDataFrame):
    tiles_in_districts = gp.sjoin(tiles, districts, how="inner", predicate="intersects")
    
    # Convert download/upload speeds from Kbps to Mbps
    tiles_in_districts['avg_d_mbps'] = tiles_in_districts['avg_d_kbps'] / 1000
    tiles_in_districts['avg_u_mbps'] = tiles_in_districts['avg_u_kbps'] / 1000
    
    return tiles_in_districts



# Function to filter districts by state name
def filter_districts_by_state(districts, state_name):
    return districts[districts['NAME_1'] == state_name]



# Main script to download, extract, and read the Ookla shapefile data
def main():
    # Get the Ookla tile URL
    tile_url = get_tile_url("mobile", 2024, 3)
    print(f"URL: {tile_url}")
    
    # Define the file paths for Ookla tiles
    zip_file_path = "tiles.zip"
    extract_folder = "tiles_data"
    
    # Check if the zip file already exists
    if not os.path.exists(zip_file_path):
        print(f"Downloading from: {tile_url}")
        download_file(tile_url, zip_file_path)
    else:
        print(f"File already exists at {zip_file_path}, skipping download.")
    
    # Extract the zip file
    if not os.path.exists(extract_folder):
        print(f"Extracting {zip_file_path} to {extract_folder}...")
        extract_zip(zip_file_path, extract_folder)
    else:
        print(f"Folder {extract_folder} already exists, skipping extraction.")
    
    # List files in the extracted folder to find the correct shapefile path
    print("Files in the extracted folder:")
    list_files(extract_folder)

    # Update the shapefile path to the correct file name
    shapefile_path = os.path.join(extract_folder, 'gps_mobile_tiles.shp')  # Correct shapefile name

    # Read the Ookla tiles data
    if os.path.exists(shapefile_path):
        tiles = gp.read_file(shapefile_path)
        print("Ookla Tiles Data:")
        print(tiles.head())
        
        # Download Indian districts shapefile from UCDavis
        district_zip_url = "https://geodata.ucdavis.edu/diva/adm/IND_adm.zip"
        district_zip_path = "IND_adm.zip"
        district_extract_folder = "indian_districts_data"
        
        # Check if the Indian districts zip file already exists
        if not os.path.exists(district_zip_path):
            print(f"Downloading Indian districts shapefile from: {district_zip_url}")
            download_file(district_zip_url, district_zip_path)
        else:
            print(f"File already exists at {district_zip_path}, skipping download.")
        
        # Extract the Indian districts zip file
        if not os.path.exists(district_extract_folder):
            print(f"Extracting {district_zip_path} to {district_extract_folder}...")
            extract_zip(district_zip_path, district_extract_folder)
        else:
            print(f"Folder {district_extract_folder} already exists, skipping extraction.")
        
        # List files in the extracted districts folder
        print("Files in the Indian districts extracted folder:")
        list_files(district_extract_folder)

        # Update the shapefile path to the correct file name (assuming you want to use IND_adm2.shp for districts)
        district_shapefile_path = os.path.join(district_extract_folder, 'IND_adm2.shp')  # Update as necessary

        # Read the Indian districts data
        if os.path.exists(district_shapefile_path):
            districts = load_indian_districts(district_shapefile_path, tiles.crs)
            
            # Print the columns of the districts GeoDataFrame
            print("Columns in the Indian districts GeoDataFrame:")
            print(districts.columns)

            # Filter for Gujarat districts
            gujarat_districts = filter_districts_by_state(districts, "Gujarat")
            
            # Perform spatial join between tiles and Gujarat districts
            tiles_in_gujarat = join_tiles_to_districts(tiles, gujarat_districts)
            
            # Display the result
            print("Tiles joined with Gujarat Districts:")
            print(tiles_in_gujarat.head())
            
            # Convert to Mbps for easier reading
            tiles_in_gujarat['avg_d_mbps'] = tiles_in_gujarat['avg_d_kbps'] / 1000
            tiles_in_gujarat['avg_u_mbps'] = tiles_in_gujarat['avg_u_kbps'] / 1000
            
            # Display the result after conversion
            print("Tiles in Gujarat with speeds in Mbps:")
            print(tiles_in_gujarat[['quadkey', 'avg_d_mbps', 'avg_u_mbps']].head())
            
        else:
            print(f"Shapefile not found at {district_shapefile_path}")

if __name__ == "__main__":
    main()
