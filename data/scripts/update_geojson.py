import csv
import json
import sys

reader = csv.DictReader(sys.stdin)

with open('raw/cpd_district_boundaries.geojson', 'r') as f:
    police_districts = json.load(f)['features']

features = []

def get_district(dist_num):
    for district in police_districts:
        if district['properties']['dist_num'] == dist_num:
            return district

for row in reader:
    district = get_district(row['dist_num'])
    district['properties'].update(row)
    features.append(district)

sys.stdout.write(json.dumps({
    "type": "FeatureCollection", 
    "features": features
}))


