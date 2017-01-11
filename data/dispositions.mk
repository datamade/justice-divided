.INTERMEDIATE : disp.clean.csv
disp.clean.csv : raw/disp-by-dist-14.csv
	csvcut -C 1 $^ | tail -n +4 | head -n 311 | perl -p -e 's/ ,/,/g; s/, /,/g; s/ $$//' > $@

.INTERMEDIATE : disp.pivot.csv
disp.pivot.csv : disp.clean.csv
	(echo 'district,disposition,female,male,unknown,total'; cat $< | python scripts/add_dist.py) > $@

dispositions_2014 : disp.pivot.csv
	csvsql --db postgresql:///$(PG_DB) --insert --table $@ --no-inference $<

.PHONY : disposition_subtables
disposition_subtables : detention_totals detention_ratios adjustment_ratios

detention_totals :
	psql -d $(PG_DB) -c "select * into $@ from dispositions_2014 where disposition = 'DETAINED (DETENTION CENTER)'"

detention_ratios : 
	psql -d $(PG_DB) -c "select district, round((num_detentions::float/num_arrests*100)::numeric, 2) as detention_ratio \
	into $@ from (select district, sum(case when disposition = 'DETAINED (DETENTION CENTER)' then total::numeric else 0 end) \
	as num_detentions, sum(total::numeric) as num_arrests from dispositions_2014 group by district) as t"

adjustment_ratios :
	psql -d $(PG_DB) -c "select district, round((num_detentions::float/num_arrests*100)::numeric, 2) as adjustment_ratio \
	into $@ from (select district, sum(case when disposition like '%ADJUSTMENT%' then total::numeric else 0 end) \
	as num_detentions, sum(total::numeric) as num_arrests from dispositions_2014 group by district) as t"