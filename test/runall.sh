#!/bin/bash
cd /home/claude/mq
for t in act1 act2 act2b act3 act4 act5 act6 act7 dbg8; do
  timeout 1500 python3 -u test/$t.py > test/reg_$t.log 2>&1
  echo "$t: $(grep -c '^OK' test/reg_$t.log) ok, $(grep -c '^FAIL' test/reg_$t.log) fail, $(grep '^errors' test/reg_$t.log | cut -c1-120)"
done
echo ALLDONE
