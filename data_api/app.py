from datetime import datetime
from flask import Flask, jsonify, request
import geopandas as gp
import pandas as pd
import requests
from tqdm import tqdm
import zipfile
import os

app = Flask(__name__)

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


# Function to load Indian districts shapefiles and combine them
def load_combined_indian_districts(shapefile_paths: list, target_crs: str):
    district_gdfs = []
    
    for shapefile_path in shapefile_paths:
        if os.path.exists(shapefile_path):
            gdf = gp.read_file(shapefile_path)
            
            # Ensure all shapefiles have the same CRS
            if gdf.crs != target_crs:
                gdf = gdf.to_crs(target_crs)
            
            district_gdfs.append(gdf)
    
    # Combine all the GeoDataFrames into one
    combined_districts = gp.GeoDataFrame(pd.concat(district_gdfs, ignore_index=True))
    
    return combined_districts

    
# Endpoint to handle API requests
@app.route('/api/state_tiles', methods=['GET'])
def state_tiles():
    state_name = request.args.get('state')
    if not state_name:
        return jsonify({"error": "State name is required"}), 400

    # Get the Ookla tile URL
    tile_url = get_tile_url("mobile", 2024, 3)
    
    # Define the file paths for Ookla tiles
    zip_file_path = "tiles.zip"
    extract_folder = "tiles_data"
    
    # Check if the zip file already exists
    if not os.path.exists(zip_file_path):
        download_file(tile_url, zip_file_path)
    
    # Extract the zip file
    if not os.path.exists(extract_folder):
        extract_zip(zip_file_path, extract_folder)

    # Update the shapefile path to the correct file name
    shapefile_path = os.path.join(extract_folder, 'gps_mobile_tiles.shp')

    # Read the Ookla tiles data
    if os.path.exists(shapefile_path):
        tiles = gp.read_file(shapefile_path)
        
        # Download Indian districts shapefile from UCDavis
        district_zip_url = "https://geodata.ucdavis.edu/diva/adm/IND_adm.zip"
        district_zip_path = "IND_adm.zip"
        district_extract_folder = "indian_districts_data"
        
        # Check if the Indian districts zip file already exists
        if not os.path.exists(district_zip_path):
            download_file(district_zip_url, district_zip_path)
        
        # Extract the Indian districts zip file
        if not os.path.exists(district_extract_folder):
            extract_zip(district_zip_path, district_extract_folder)

        # Define paths for all administrative levels (0, 1, 2, 3)
        district_shapefile_paths = [
            os.path.join(district_extract_folder, 'IND_adm0.shp'),
            os.path.join(district_extract_folder, 'IND_adm1.shp'),
            os.path.join(district_extract_folder, 'IND_adm2.shp'),
            os.path.join(district_extract_folder, 'IND_adm3.shp')
        ]

        # Combine all district levels
        districts = load_combined_indian_districts(district_shapefile_paths, tiles.crs)
        
        # Filter districts by the provided state name
        filtered_districts = filter_districts_by_state(districts, state_name)
        
        if filtered_districts.empty:
            return jsonify({"error": f"No districts found for the state: {state_name}"}), 404

        # Perform spatial join between tiles and filtered districts
        tiles_in_state = join_tiles_to_districts(tiles, filtered_districts)
        
        # Convert to a list of dictionaries for JSON response
        result = tiles_in_state[['quadkey', 'VARNAME_2', 'avg_d_mbps', 'avg_u_mbps']].to_dict(orient='records')
        
        return jsonify(result), 200
    else:
        return jsonify({"error": "Ookla tiles shapefile not found"}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
