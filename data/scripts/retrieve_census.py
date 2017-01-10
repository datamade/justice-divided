# acs5 docs: http://api.census.gov/data/2015/acs5/variables.html

import csv
import json
import sys

from census_area import Census

from config import CENSUS_API_KEY

c = Census(CENSUS_API_KEY)

black_alone_total = "B02001_003E"
all_total = "B02001_001E"

with open("raw/police_district_boundaries.geojson", "r") as f:
    police_districts = json.load(f)

writer = csv.writer(sys.stdout)

for district in police_districts["features"]:
    dist_num = district["properties"]["dist_num"]
    if dist_num == "31": # omit norridge, harwood heights, and mt. greenwood cemetery
        continue
    dist_data = [dist_num, 0, 0]
    black_pop = c.acs5.geo_blockgroup(("NAME", black_alone_total), district["geometry"])
    for _, blockgroup_data in black_pop:
        dist_data[1] += int(blockgroup_data[black_alone_total])
    total_pop = c.acs5.geo_blockgroup(("NAME", all_total), district["geometry"])
    for _, blockgroup_data in total_pop:
        dist_data[2] += int(blockgroup_data[all_total])
    pct_black = round(dist_data[1]/dist_data[2]*100, 2)
    dist_data.append(pct_black)
    writer.writerow(dist_data)
