output/police_district_population.geojson : raw/police_district_boundaries.geojson
	python scripts/retrieve_census.py > $@
