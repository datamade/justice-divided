output/djj_exits.csv : raw/djj_exits_by_zip.xlsx
	in2csv $< | python scripts/clean_djj_exits.py > $@

.PHONY : djj-race-totals
djj-race-totals : output/djj_exits.csv
	csvsql --query "select demo, sum(\`2015\`) as total_15 from $(notdir $(basename $<)) group by demo" $< |\
	csvsort -c total_15 -r