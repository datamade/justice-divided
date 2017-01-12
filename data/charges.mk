.INTERMEDIATE : charges.clean.csv
charges.clean.csv : raw/arrests_by_charge_14.csv
	(echo dist_num,offense,felony,misdemeanor,other,total; \
	csvcut -c 2,3,4,5,6,7 $< | \
	tail -n +6 | head -n 595 | \
	perl -p -e 's/\s?,\s?/,/g; s/ {2,}/ /g') > $@

charges_2014 : charges.clean.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ $<

.PHONY : charge_subtables
charge_subtables : charge_totals class_totals_by_district top_charge_by_district mf_ratio_by_district

charge_totals :
	psql -d $(PG_DB) -c " \
		SELECT \
		  offense, \
		  SUM(misdemeanor) AS num_misdemeanor, \
		  SUM(felony) AS num_felony, \
		  SUM(other) AS num_other, \
		  ROUND(\
		    SUM(misdemeanor)::numeric / NULLIF( \
		    SUM(felony), 0), 2) AS mf_ratio, \
		  SUM(total) AS total \
		INTO $@ \
		FROM charges_2014 \
		GROUP BY offense \
		ORDER BY total DESC"

class_totals_by_district :
	psql -d $(PG_DB) -c " \
		SELECT \
		  dist_num, \
		  SUM(misdemeanor) AS num_misdemeanor, \
		  SUM(felony) AS num_felony, \
		  SUM(other) AS num_other, \
		  SUM(total) AS total \
		INTO $@ \
		FROM charges_2014 \
		GROUP BY dist_num \
		ORDER BY dist_num"

top_charge_by_district :
	psql -d $(PG_DB) -c " \
		SELECT DISTINCT ON (dist_num) \
		  dist_num, \
		  offense, \
		  total \
		INTO $@ \
		FROM charges_2014 \
		ORDER BY dist_num, total DESC"

mf_ratio_by_district :
	psql -d $(PG_DB) -c " \
		SELECT \
		  dist_num, \
		  ROUND( \
		    num_misdemeanor::numeric / num_felony, 2) AS mf_ratio \
		INTO $@ \
		FROM class_totals_by_district \
		ORDER BY dist_num"
