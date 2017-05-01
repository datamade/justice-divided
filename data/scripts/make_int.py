import csv
import sys

reader = csv.reader(sys.stdin)
writer = csv.writer(sys.stdout)

writer.writerow(next(reader))

for row in reader:
    if ',' in row[-1]:
        row[-1] = row[-1].replace(',', '')
    row[-1] = int(row[-1])
    writer.writerow(row)