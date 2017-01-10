# acs5 docs: view-source:http://api.census.gov/data/2015/acs5/variables.html

import json
import sys

from census_area import Census

c = Census("ce143e4c445f1ccaed3aa214715bebcb9a487cfa")

black_alone_total = "B02001_003E"
all_total = "B02001_001E"

with open("raw/police_district_boundaries.geojson", "r") as f:
    geojson = f.read()
    police_districts = json.loads(geojson)

features = []

for district in police_districts["features"]:
    if district["properties"]["dist_num"] == "31":
        continue
    district["properties"].update({"black_population": 0, "total_population": 0})
    black_pop = c.acs5.geo_tract(("NAME", black_alone_total), district["geometry"])
    for _, tract_data in black_pop:
        district["properties"]["black_population"] += int(tract_data[black_alone_total])
    total_pop = c.acs5.geo_tract(("NAME", all_total), district["geometry"])
    for _, tract_data in total_pop:
        district["properties"]["total_population"] += int(tract_data[all_total])
    features.append(district)

sys.stdout.write(json.dumps({"type": "FeatureCollection", "features": features}, indent=4))