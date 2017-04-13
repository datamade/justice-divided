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
		  demo.num_youth, \
		  num_black_youth AS num_youth_black, \
		  pct_black AS pct_youth_black, \
		  num_hispanic_youth AS num_youth_hispanic, \
		  pct_hispanic AS pct_youth_hispanic, \
		  num_white_youth AS num_youth_white, \
		  pct_white AS pct_youth_white, \
		  num_arrests_black + num_arrests_hispanic + num_arrests_white \
		    AS num_arrests, \
		  num_arrests_black, \
		  pct_arrests_black, \
		  num_arrests_hispanic, \
		  pct_arrests_hispanic, \
		  num_arrests_white, \
		  pct_arrests_white, \
		  num_arrests_black + num_arrests_hispanic + num_arrests_white
		INTO $@ \
		FROM juvenile_demographic_percents_by_district AS demo \
		JOIN juvenile_demographic_totals_by_district AS total \
		  ON demo.dist_num = total.dist_num \
		JOIN police_district_names AS name \
		  ON demo.dist_num = name.dist_num \
		JOIN arrests_by_race_by_district AS blk \
		  ON demo.dist_num = blk.dist_num"
	
output/police_district_profiles.geojson : 
	psql -d $(PG_DB) -c "\\copy (select * from district_profiles) \
		to stdout with csv header" | python scripts/update_geojson.py > $@

all : $(PG_DB) $(TABLES) output/police_district_profiles.geojson

clean :
	rm output/*