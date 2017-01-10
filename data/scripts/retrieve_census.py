# acs5 docs: view-source:http://api.census.gov/data/2015/acs5/variables.html

import csv
import json
import sys

from census_area import Census

from config import CENSUS_API_KEY

c = Census(CENSUS_API_KEY)

black_alone_total = "B02001_003E"
all_total = "B02001_001E"

with open("raw/police_district_boundaries.geojson", "r") as f:
    geojson = f.read()
    police_districts = json.loads(geojson)

writer = csv.writer(sys.stdout)

for district in police_districts["features"]:
    dist_num = district["properties"]["dist_num"]
    # omit norridge, harwood heights, and mt. greenwood cemetery
    if dist_num == "31":
        continue
    dist_data = [dist_num, 0, 0]
    black_pop = c.acs5.geo_tract(("NAME", black_alone_total), district["geometry"])
    for _, tract_data in black_pop:
        dist_data[1] += int(tract_data[black_alone_total])
    total_pop = c.acs5.geo_tract(("NAME", all_total), district["geometry"])
    for _, tract_data in total_pop:
        dist_data[2] += int(tract_data[all_total])
    dist_data.append(round(dist_data[1]/dist_data[2]*100, 2))
    writer.writerow(dist_data)
