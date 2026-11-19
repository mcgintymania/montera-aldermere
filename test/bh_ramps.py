import re, sys
from collections import deque
from pathlib import Path
s = Path(__file__).resolve().parent.parent.joinpath('brightholm/bh_town3.js').read_text()
m = re.search(r"DATA\.maps\.vantage_hall = \{.*?rows: \[(.*?)\].*?npcs: \[(.*?)\n  \],", s, re.S)
R = re.findall(r"'(.*?)'", m.group(1))
npc = {(int(a), int(b)) for a, b in re.findall(r"x: (\d+), y: (\d+)", m.group(2))}
sl = {'^': (0, -1), '<': (-1, 0), '>': (1, 0), ':': (0, 1)}
def free(x, y): return 0 <= y < len(R) and 0 <= x < len(R[y]) and R[y][x] not in 'WJ¦' and (x, y) not in npc
def settle(x, y):
    seen = set()
    while R[y][x] in sl and (x, y) not in seen:
        seen.add((x, y)); dx, dy = sl[R[y][x]]
        if not free(x + dx, y + dy): break
        x, y = x + dx, y + dy
    return x, y
def reach(start):
    q = deque([start]); S = {start}
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if not free(nx, ny): continue
            t = settle(nx, ny)
            if t not in S: S.add(t); q.append(t)
    return S
fails = 0
def check(ok, msg):
    global fails
    print(('PASS ' if ok else 'FAIL ') + msg); fails += 0 if ok else 1
check((7, 3) in reach((7, 15)), 'the ramps lead from the door to Zara')
check(any(R[y][x] == 'm' for x, y in reach((7, 3))), 'you can leave after beating Zara')
sys.exit(1 if fails else 0)
