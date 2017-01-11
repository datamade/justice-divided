SHELL := bash

PG_DB = jdiv
METADATA = police_district_metadata
RAW_TABLES = arrests_2014 charges_2014 dispositions_2014 djj_exits_2009_thru_2015
SUBTABLES = arrest_subtables charge_subtables disposition_subtables djj_exits_by_race

.PHONY : database
database : $(PG_DB) $(METADATA) $(RAW_TABLES) $(SUBTABLES) composite

$(PG_DB) :
	createdb $@

raw/cpd-dist-names.csv :
	# hand compiled from cpd website

output/police_district_demographics.csv : raw/police_district_boundaries.geojson
	(echo dist_num,black_pop,total_pop,pct_black; python scripts/retrieve_census.py) | \
	csvsort -c 1 > $@

$(METADATA) : raw/cpd-dist-names.csv output/police_district_demographics.csv
	csvjoin -c "dist_num,dist_num" $^ | \
	csvsql --db postgresql:///$(PG_DB) --insert --table $@

include arrests.mk charges.mk dispositions.mk djj_exits.mk

composite : 
	psql -d $(PG_DB) -c "\
		select mf.dist_num, dist_name, total_pop, pct_black, offense as top_offense, \
		mf_ratio, num_arrests, pct_arrests_black, detention_ratio, adjustment_ratio into $@ from police_district_metadata \
		join arrests_by_district as arr on dist_num = district\
		join ratio_arrests_black as blk on arr.district::int = blk.district::int\
		join adjustment_ratios as adj on adj.district::int = arr.district::int\
		join detention_ratios as det on adj.district::int = det.district::int\
		join top_charge_by_district as tc on adj.district::int = tc.dist_num::int\
		join mf_ratio_by_district as mf on adj.district::int = mf.dist_num::int"

.PHONY : clean
clean :
	dropdb $(PG_DB)