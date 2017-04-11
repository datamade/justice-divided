import csv
import sys

reader = csv.reader(sys.stdin)
writer = csv.writer(sys.stdout)

next(reader)

parent_district = None

for row in reader:
	district = row[0]
	if district:
		parent_district = district
	else:
		row[0] = parent_district
	writer.writerow(row)




