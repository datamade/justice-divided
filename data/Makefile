SHELL := bash

PG_DB = jdiv
TABLES = arrests_by_district_2014 arrests_by_demographic_2013_thru_2017 \
	police_district_names police_district_demographics district_profiles
SUBTABLES = arrests_by_district_subtables arrests_by_demographic_subtables demographic_subtables

.PHONY : all clean $(PG_DB) $(TABLES) $(SUBTABLES) 

.INTERMEDIATE : arrests_by_police_district.clean.csv arrests_by_demographic.clean.csv

$(PG_DB) : 
	createdb $@

include arrests_by_district.mk arrests_by_demographic.mk demographics.mk map.mk

all : $(PG_DB) $(TABLES) $(SUBTABLES) output/police_district_profiles.geojson

clean :
	dropdb $(PG_DB)
	rm output/*