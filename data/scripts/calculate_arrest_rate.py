import csv
import sys

reader = csv.reader(sys.stdin)
writer = csv.writer(sys.stdout)

next(reader)

writer.writerow(['race', 'num_arrests', 'population', 'arrest_rate'])

for row in reader:
    _, num_arrests, _, race, population = row
    arrest_rate = round(float(num_arrests) / float(population) * 100, 2)
    writer.writerow([race, num_arrests, population, arrest_rate])