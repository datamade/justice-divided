SHELL := bash

PG_DB = jdiv
METADATA = police_district_metadata
RAW_TABLES = arrests_2014 charges_2014 dispositions_2014 djj_exits_2009_thru_2015
SUBTABLES = arrest_subtables charge_subtables disposition_subtables djj_exits_by_race

.PHONY : database
database : $(PG_DB) $(METADATA) $(RAW_TABLES) $(SUBTABLES) district_profiles

$(PG_DB) :
	createdb $@

raw/cpd-dist-names.csv :
	# hand compiled from cpd website

output/police_district_demographics.csv : raw/police_district_boundaries.geojson
	(echo dist_num,black_pop,total_pop,pct_black; python scripts/retrieve_census.py) | \
	csvsort -c 1 > $@

$(METADATA) : raw/cpd-dist-names.csv output/police_district_demographics.csv
	csvjoin -c "dist_num,dist_num" $^ | \
	csvsort -c "dist_num" | \
	csvsql --db postgresql:///$(PG_DB) --insert --table $@

include arrests.mk charges.mk dispositions.mk djj_exits.mk

district_profiles : 
	psql -d $(PG_DB) -c " \
		SELECT \
		  met.dist_num, \
		  dist_name, \
		  total_pop, \
		  pct_black AS pct_pop_black, \
		  offense AS top_offense, \
		  mf_ratio, \
		  arr.num_arrests, \
		  pct_arrests_black, \
		  num_adjustments, \
		  adjustment_ratio, \
		  num_detentions, \
		  detention_ratio \
		INTO $@ \
		FROM police_district_metadata AS met \
		JOIN arrests_by_district AS arr \
		  ON arr.dist_num = met.dist_num \
		JOIN ratio_arrests_black_by_district AS blk \
		  ON arr.dist_num = blk.dist_num \
		JOIN adjustment_by_district AS adj \
		  ON arr.dist_num = adj.dist_num::int \
		JOIN detention_by_district AS det \
		  ON arr.dist_num = det.dist_num::int \
		JOIN top_charge_by_district AS tc \
		  ON arr.dist_num = tc.dist_num \
		JOIN mf_ratio_by_district AS mf \
		  ON arr.dist_num = mf.dist_num"

.PHONY : clean
clean :
	dropdb $(PG_DB)