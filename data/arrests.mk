.INTERMEDIATE : arrests.clean.csv
arrests.clean.csv : raw/arrests-14.csv
	perl -p -e 's/\s{2,}//; s/(AGE,{8}|TOTAL)/$$1\n/g' $< | tail -n +2 | head -n 111 | \
	python scripts/make_int.py > $@

.INTERMEDIATE : arrests.pivot.csv
arrests.pivot.csv : arrests.clean.csv
	(echo 'district,race,5-10,11,12,13,14,15,16,17,total'; csvcut -C 1 $< | python scripts/add_dist.py) > $@

arrests_2014 : arrests.pivot.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<

.PHONY : arrest_subtables
arrest_subtables : arrests_by_district arrests_by_race ratio_arrests_black

arrests_by_district :
	psql -d $(PG_DB) -c "select district, sum(total) as num_arrests into $@ from arrests_2014 group by district"

arrests_by_race :
	psql -d $(PG_DB) -c "select race, sum(total) as num_arrests into $@ from arrests_2014 group by race"

ratio_arrests_black :
	psql -d $(PG_DB) -c "select district, \
	round((sum(case when race = 'BLACK' then total else 0 end)\
		 /(sum(total))::float*100)::numeric, 2) as pct_arrests_black \
	into $@ from arrests_2014 group by district"