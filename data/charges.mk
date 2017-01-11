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
	psql -d $(PG_DB) -c "select offense, sum(misdemeanor) as misdemeanor, sum(felony) as felony, \
	sum(other) as other, sum(total) as total into $@ from charges_2014 group by offense"

class_totals_by_district :
	psql -d $(PG_DB) -c "select dist_num, sum(misdemeanor) as num_misdemeanor, sum(felony) as num_felony, \
	sum(other) as num_other, sum(total) as total into $@ from charges_2014 group by dist_num"

top_charge_by_district :
	psql -d $(PG_DB) -c "select * into $@ from (select dist_num, offense, total, max(total) \
	over (partition by dist_num) as max_arrests from charges_2014) t where total = max_arrests"

mf_ratio_by_district :
	psql -d $(PG_DB) -c "select dist_num, round(num_misdemeanor/num_felony,2) as mf_ratio into $@ from class_totals_by_district"
