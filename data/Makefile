SHELL := bash

PG_DB = jdiv
TABLES = arrests_2014 police_district_names police_district_demographics district_profiles

.PHONY : all clean arrests_2014 police_district_names arrests_subtables \
	police_district_demographics demographic_subtables district_profiles

.INTERMEDIATE : arrests.clean.csv

$(PG_DB) : 
	createdb $@

include arrests.mk demographics.mk

raw/cpd-dist-names.csv :
	# hand compiled from cpd website

police_district_names : raw/cpd-dist-names.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<
 
district_profiles : arrest_subtables demographic_subtables
	psql -d $(PG_DB) -c " \
		SELECT \
		  demo.dist_num, \
		  dist_name, \
		  num_youth, \
		  pct_black, \
		  pct_hispanic, \
		  pct_white, \
		  arr.num_arrests, \
		  pct_arrests_black, \
		  pct_arrests_black - pct_black AS arrest_pop_difference \
		INTO $@ \
		FROM juvenile_demographic_percents_by_district AS demo \
		JOIN police_district_names AS name \
		  ON demo.dist_num = name.dist_num \
		JOIN arrests_by_district AS arr \
		  ON demo.dist_num = arr.dist_num \
		JOIN ratio_arrests_black_by_district AS blk \
		  ON demo.dist_num = blk.dist_num"
	
output/police_district_profiles.geojson : 
	psql -d $(PG_DB) -c "\\copy (select * from district_profiles) \
		to stdout with csv header" | python scripts/update_geojson.py > $@

all : $(PG_DB) $(TABLES) output/police_district_profiles.geojson

clean :
	rm output/*