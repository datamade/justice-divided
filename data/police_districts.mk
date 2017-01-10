output/police_district_demographics.csv : raw/police_district_boundaries.geojson
	(echo dist_num,black_pop,total_pop,pct_black; \
	 python scripts/retrieve_census.py) > $@