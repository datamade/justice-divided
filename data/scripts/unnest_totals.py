import csv
import sys

_, infile = sys.argv

reader = csv.reader(open(infile, 'r'))
writer = csv.writer(sys.stdout)

writer.writerow(next(reader))

for row in reader:
    total = int(row[-1])
    for i in range(0, total):
        writer.writerow(row)