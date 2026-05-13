import re, pathlib, subprocess
path = pathlib.Path('index.html')
text = path.read_text(encoding='utf-8')
scripts = re.findall(r'<script>(.*?)</script>', text, flags=re.S)
print('SCRIPTS', len(scripts))
if not scripts:
    raise SystemExit('No script blocks found')
for i, script in enumerate(scripts, start=1):
    script = re.sub(r'<!--|-->', '', script)
    temp_path = pathlib.Path(f'tmp_script_{i}.js')
    temp_path.write_text(script, encoding='utf-8')
    proc = subprocess.run(['node', '-c', str(temp_path)], capture_output=True, text=True)
    print(f'[{i}] EXIT', proc.returncode)
    if proc.returncode != 0:
        print(proc.stderr)
