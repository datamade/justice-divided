output/police_district_demographics.csv : 
	python scripts/get_police_district_demos.py | csvsort -c dist_num > $@

police_district_demographics : output/police_district_demographics.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<

demographic_subtables : juvenile_demographic_totals juvenile_demographic_percents \
	juvenile_demographic_totals_by_district juvenile_demographic_percents_by_district

juvenile_demographic_totals : 
	psql -d $(PG_DB) -c " \
		SELECT \
		  SUM(black_female) + SUM(white_female) + SUM(hispanic_female) \
		    + SUM(black_male) + SUM(white_male) + SUM(hispanic_male) AS num_youth, \
		  SUM(black_female) + SUM(white_female) + SUM(hispanic_female) AS num_female_youth, \
		  SUM(black_male) + SUM(white_male) + SUM(hispanic_male) AS num_male_youth, \
		  SUM(black_female) AS num_black_female, \
		  SUM(black_male) AS num_black_male, \
		  SUM(black_male) + SUM(black_female) as num_black_youth, \
		  SUM(hispanic_female) AS num_hispanic_female, \
		  SUM(hispanic_male) AS num_hispanic_male, \
		  SUM(hispanic_male) + SUM(hispanic_female) as num_hispanic_youth, \
		  SUM(white_female) AS num_white_female, \
		  SUM(white_male) AS num_white_male, \
		  SUM(white_male) + SUM(white_female) as num_white_youth \
		INTO $@ \
		FROM police_district_demographics;"

juvenile_demographic_percents : 
	psql -d $(PG_DB) -c " \
		SELECT \
		  num_youth, \
		  num_black_youth::numeric / num_youth AS pct_black_youth, \
		  num_hispanic_youth::numeric / num_youth AS pct_hispanic_youth, \
		  num_white_youth::numeric / num_youth AS pct_white_youth \
		INTO $@ \
		FROM juvenile_demographic_totals"

juvenile_demographic_totals_by_district :
	psql -d $(PG_DB) -c " \
		SELECT \
		  dist_num, \
		  black_female + hispanic_female + white_female \
		    + black_male + hispanic_male + white_male AS num_youth, \
		  black_female + black_male AS num_black_youth, \
		  black_female AS num_black_female, \
		  black_male AS num_black_male, \
		  white_female + white_male AS num_white_youth, \
		  white_female AS num_white_female, \
		  white_male AS num_white_male, \
		  hispanic_female + hispanic_male AS num_hispanic_youth, \
		  hispanic_female AS num_hispanic_female, \
		  hispanic_male AS num_hispanic_male \
		INTO $@ \
		FROM police_district_demographics;"

juvenile_demographic_percents_by_district :
	psql -d $(PG_DB) -c " \
		SELECT \
		  dist_num, \
		  num_youth, \
		  num_black_youth::numeric / num_youth AS pct_black, \
		  num_hispanic_youth::numeric / num_youth AS pct_hispanic, \
		  num_white_youth::numeric / num_youth AS pct_white \
		INTO $@ \
		FROM juvenile_demographic_totals_by_district"
