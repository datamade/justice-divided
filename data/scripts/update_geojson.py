import csv
import json
import sys

with open('raw/cpd_district_boundaries.geojson') as f:
    police_districts = json.load(f)

updated_police_districts = []

reader = csv.DictReader(sys.stdin)
for row in reader:
    feature = [district for district in police_districts['features'] \
               if district['properties']['dist_num'] == row['dist_num']][0]
    feature['properties'].update(row)
    updated_police_districts.append(feature)

sys.stdout.write(json.dumps({"type": "FeatureCollection", "features": updated_police_districts}))

