"""Independent Blender apparatus for the pondweed-rate practical; metres, Z up."""
import bpy,os,json
previous_scene=bpy.context.window.scene
source_path=os.path.join(os.path.dirname(__file__),'create_science_lab.py')
exec(compile(open(source_path).read().split('# Architecture:')[0],source_path,'exec'))
scene.name='Pondweed apparatus asset workshop'
props={}
def asset(key):
 global COL
 COL=collection('ASSET • '+key);COL.asset_mark();COL.asset_data.description='Pondweed experiment '+key+'; separate metric model, base origin.';props[key]=COL
asset('pondweed-lamp')
cyl('Rubber anti slip foot',(0,0,.014),.142,.028,rubber)
cyl('Weighted enamel lamp base',(0,0,.045),.135,.042,teal)
rod('Chrome lamp upright',(0,0,.065),(0,0,.34),.015,steel)
rod('Adjustable lamp neck',(0,0,.33),(.07,0,.42),.013,steel)
sphere('Lamp swivel',(.07,0,.42),(.031,.031,.031),black)
shade=lathe('Open metal reflector',[(.045,0),(.055,.025),(.115,.17),(.12,.18),(.112,.18),(.106,.17),(.047,.027),(.04,0)],edge)
shade.location=(.035,0,.42);shade.rotation_euler[1]=math.pi/2
sphere('Frosted light bulb',(.165,0,.42),(.046,.043,.043),white)
for i in range(6):
 box('Ventilation slot',(.045+i*.012,.052,.445),(.006,.003,.018),black,.001)
tube('Lamp flex',[(-.08,0,.035),(-.2,.06,.018),(-.32,.17,.014),(-.42,.18,.014)],.009,rubber)
asset('water-heat-shield')
for x in [-.068,.068]:box('Glass tank side',(x,0,.19),(.007,.44,.38),glass,.003)
for y in [-.218,.218]:box('Glass tank end',(0,y,.19),(.136,.007,.38),glass,.003)
box('Glass tank base',(0,0,.009),(.143,.447,.018),glass,.003)
box('Water heat filter',(0,0,.168),(.121,.425,.3),water,.002)
for x in [-.073,.073]:box('Tank edge trim',(x,0,.008),(.012,.456,.016),steel,.003)
asset('boiling-tube-holder')
box('Weighted clamp base',(0,.065,.024),(.29,.3,.048),teal,.018)
rod('Steel stand upright',(0,.16,.04),(0,.16,.64),.012,steel)
rod('Clamp support arm',(0,.16,.39),(0,.025,.39),.012,steel)
ring=torus('Tube support padded ring',(0,0,.39),.082,.011,rubber)
rod('Clamp screw',(.08,0,.39),(.125,0,.39),.009,steel)
sphere('Clamp screw knob',(.13,0,.39),(.014,.021,.021),black)
asset('lab-thermometer')
rod('Glass thermometer stem',(0,0,.018),(0,0,.43),.011,glass)
rod('Red alcohol column',(0,-.007,.018),(0,-.007,.25),.003,red)
sphere('Thermometer bulb',(0,0,.014),(.012,.012,.016),red)
for i in range(16):
 box('Thermometer graduation',(.005,-.010,.065+i*.022),(.013 if i%5==0 else .007,.001,.0015),ink,.0002)
# Export each collection independently and write appendable native Blender files.
os.makedirs(os.path.join(OUT,'props'),exist_ok=True)
for key,c in props.items():
 bpy.data.libraries.write(os.path.join(OUT,'props',key+'.blend'),{c},fake_user=True,compress=True)
 bpy.ops.object.select_all(action='DESELECT')
 for obj in c.objects:obj.select_set(True)
 with bpy.context.temp_override(scene=scene,view_layer=scene.view_layers[0]):
  bpy.ops.export_scene.gltf(filepath=os.path.join(WEB,'props',key+'.glb'),export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_animations=False)
manifest_path=os.path.join(WEB,'manifest.json');manifest=json.load(open(manifest_path));manifest['props']=list(dict.fromkeys(manifest['props']+list(props)))
with open(manifest_path,'w') as f:json.dump(manifest,f,indent=2)
bpy.context.window.scene=previous_scene
print('Created pondweed assets:',list(props))
