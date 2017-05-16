SHELL := bash

PG_DB = jdiv
RAW_TABLES = arrests_by_district_2014 arrests_by_demographic_2013_thru_2017 \
	police_district_names police_district_demographics district_profiles \
	djj_exits_to_chicago
SUBTABLES = arrests_by_district_subtables arrests_by_demographic_subtables \
	demographic_subtables djj_exits_to_chicago_by_race

.PHONY : all clean $(PG_DB) $(RAW_TABLES) $(SUBTABLES) 

.INTERMEDIATE : arrests_by_police_district.clean.csv arrests_by_demographic.clean.csv \
	djj_exits_to_cook_county.csv chicago_zips.csv

all : $(PG_DB) $(RAW_TABLES) $(SUBTABLES) output/police_district_profiles.geojson

clean :
	rm output/*
	dropdb $(PG_DB)

$(PG_DB) : 
	createdb $@

include arrests_by_district.mk arrests_by_demographic.mk demographics.mk map.mk \
	detention.mk

