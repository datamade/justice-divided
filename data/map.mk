raw/cpd-dist-names.csv :
	# hand compiled from cpd website

police_district_names : raw/cpd-dist-names.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<
 
district_profiles : arrests_by_district_subtables demographic_subtables
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
		  pct_arrests_white \
		INTO $@ \
		FROM juvenile_demographic_percents_by_district AS demo \
		JOIN juvenile_demographic_totals_by_district AS total \
		  ON demo.dist_num = total.dist_num \
		JOIN police_district_names AS name \
		  ON demo.dist_num = name.dist_num \
		JOIN arrests_by_race_by_district AS blk \
		  ON demo.dist_num = blk.dist_num"

output/police_district_profiles.csv : 
	psql -d $(PG_DB) -c "\\copy (select * from district_profiles) \
		to stdout with csv header" > $@
	
output/police_district_profiles.geojson : output/police_district_profiles.csv
	cat $^ | python scripts/update_geojson.py > $@
