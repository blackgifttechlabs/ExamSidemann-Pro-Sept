"""Compress Agriculture lesson illustrations and verify their asset references."""
from pathlib import Path
from PIL import Image
import json,sys
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'public/images/agriculture'
PROGRESS=ROOT/'tmp/agriculture-image-progress'
PROGRESS.mkdir(parents=True,exist_ok=True)
def compress(source,name,kind):
 source=Path(source);target=ASSETS/name
 if not target.resolve().is_relative_to(ASSETS.resolve()):raise ValueError('Invalid destination')
 target.parent.mkdir(parents=True,exist_ok=True)
 with Image.open(source) as image:
  image.thumbnail((1200,800),Image.Resampling.LANCZOS)
  image=image.convert('RGBA') if 'A' in image.getbands() else image.convert('RGB')
  image.save(target,'WEBP',quality=82,method=4)
  record={'name':name,'kind':kind,'width':image.width,'height':image.height,'original_bytes':source.stat().st_size,'compressed_bytes':target.stat().st_size,'status':'complete'}
 (PROGRESS/(name.replace('/','__')+'.json')).write_text(json.dumps(record))
 print(json.dumps(record))
manifest=json.load(open(ASSETS/'generation-prompts.json'))
if sys.argv[1]=='existing':
 for item in manifest['images']:
  if item['existing_source']:compress(ROOT/item['existing_source'],item['output'],'existing')
elif sys.argv[1]=='audit':
 missing=[i['output'] for i in manifest['images'] if not (ASSETS/i['output']).exists()]
 (ROOT/'src/features/courses/common/agricultureMissingImages.ts').write_text('// Updated by scripts/agricultureImageAssets.py audit.\nexport const MISSING_AGRICULTURE_IMAGES = new Set<string>('+json.dumps(missing,indent=2)+');\n')
 records={r['name']:r for p in PROGRESS.glob('*.json') if (r:=json.loads(p.read_text()))}
 for item in manifest['images']:
  target=ASSETS/item['output']
  if target.exists() and item['output'] not in records:
   with Image.open(target) as image:
    records[item['output']]={'name':item['output'],'kind':'existing' if item['existing_source'] else 'generated','width':image.width,'height':image.height,'original_bytes':None,'compressed_bytes':target.stat().st_size,'status':'complete'}
 records=list(records.values())
 (ASSETS/'compression-report.json').write_text(json.dumps(records,indent=2)+'\n')
 ready=[i for i in manifest['images'] if i['output'] not in missing]
 (ASSETS/'generation-status.json').write_text(json.dumps({'requested':len(manifest['images']),'ready':len(ready),'new_images_generated':sum(not i['existing_source'] for i in ready),'existing_images_fixed':sum(bool(i['existing_source']) for i in ready),'pending':missing},indent=2)+'\n')
 print(json.dumps({'references':len(manifest['images']),'missing':missing,'saved_bytes':sum((ASSETS/i['output']).stat().st_size for i in manifest['images'] if (ASSETS/i['output']).exists())}))
else:compress(sys.argv[1],sys.argv[2],'generated')
