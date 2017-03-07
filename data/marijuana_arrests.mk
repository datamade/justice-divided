misdemeanor_marijuana_arrests.filtered.csv : raw/misdemeanor_cannabis_arrests.csv
	csvgrep -c "ARREST DATE" -r '\d{2}-.*-15' $< | \
	csvgrep -c AGE -r '1[0-9]' | \
	csvgrep -c SEX -m 'M' > $@

output/misdemeanor_marijuana_arrests.csv : misdemeanor_marijuana_arrests.filtered.csv
	python scripts/decode_race.py $< > $@

misdemeanor_marijuana_arrests : output/misdemeanor_marijuana_arrests.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $(basename $(notdir $<)) $<

output/arrests_by_race.csv : misdemeanor_marijuana_arrests
	psql -d $(PG_DB) -c '\copy ( \
		SELECT \
		  race, \
		  num_arrests, \
		  ROUND( \
			num_arrests / SUM( num_arrests) OVER () * 100, 2) as percent_total \
		FROM ( \
		  SELECT \
			  race, \
			  COUNT(*) AS num_arrests \
		  FROM $< \
		  GROUP BY race) AS t \
		ORDER BY percent_total DESC) to STDOUT with csv header' > $@

output/arrest_rate_by_race.csv : output/arrests_by_race.csv male_youth_population.csv
	csvjoin -c race $^ | python scripts/calculate_arrest_rate.py > $@