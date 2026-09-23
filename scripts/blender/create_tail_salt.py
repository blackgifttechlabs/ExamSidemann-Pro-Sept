"""Run: blender -b --python scripts/blender/create_tail_salt.py
Builds an editable rigged scene and a browser-ready, baked glTF animation.
"""
import bpy, math, os, json
from mathutils import Vector
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
HOUSE_COUNT = 6
VISIT_SECONDS = 6
RETURN_SECONDS = 1.6
RETURN_START = (HOUSE_COUNT - 1) * VISIT_SECONDS
DURATION = RETURN_START + (HOUSE_COUNT - 1) * RETURN_SECONDS
END_FRAME = 1 + round(DURATION * 24)
HOUSE_X = [(i - (HOUSE_COUNT - 1) / 2) * 4 for i in range(HOUSE_COUNT)]
scene.frame_start=1; scene.frame_end=END_FRAME; scene.render.fps=24
scene.timeline_markers.clear()

def mat(name, color, metallic=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*color,1); bs.inputs['Roughness'].default_value=.48; bs.inputs['Metallic'].default_value=metallic
 return m
plaster=[mat('Warm ivory plaster',(.79,.72,.58)),mat('Sage plaster',(.43,.62,.51)),mat('Blue plaster',(.43,.57,.68))]
plaster += [mat('Dusty rose plaster',(.7,.49,.43)), mat('Butter plaster',(.78,.69,.4)), mat('Lavender plaster',(.55,.51,.65))]
roof=mat('Terracotta',(.32,.12,.07)); trim=mat('Painted cream',(.91,.88,.77)); wood=mat('Oak',(.24,.105,.045)); glass=mat('Blue glass',(.12,.27,.34),.35)
grass=mat('Garden',(.32,.43,.25)); path=mat('Sandstone paving',(.64,.59,.49)); black=mat('Joint rubber',(.055,.065,.075)); white=mat('Chef whites',(.93,.92,.87)); metal=mat('Salt lid',(.45,.49,.52),.7)
colors=[mat('Cook navy',(.08,.17,.26)),mat('Neighbour ochre',(.7,.32,.08)),mat('Neighbour teal',(.05,.4,.37))]

colors += [mat('Neighbour plum',(.36,.13,.4)), mat('Neighbour blue',(.13,.3,.64)), mat('Neighbour red',(.62,.15,.16))]

def cube(name,loc,scale,material,bevel=.04):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.name=name; o.dimensions=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 o.data.materials.append(material)
 if bevel:
  mod=o.modifiers.new('Soft edges','BEVEL'); mod.width=bevel; mod.segments=2
  o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return o

def sphere(name,loc,scale,material):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,location=loc); o=bpy.context.object; o.name=name; o.scale=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); o.data.materials.append(material)
 for p in o.data.polygons:p.use_smooth=True
 return o

def rod(name,a,b,r,material):
 a,b=Vector(a),Vector(b); bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=(b-a).length,location=(a+b)/2); o=bpy.context.object; o.name=name; o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler(); o.data.materials.append(material)
 for p in o.data.polygons:p.use_smooth=True
 return o

def label(text,loc,size,material):
 bpy.ops.object.text_add(location=loc,rotation=(math.pi/2,0,0)); o=bpy.context.object; o.name=text; o.data.body=text; o.data.align_x='CENTER'; o.data.size=size; o.data.extrude=.002; o.data.materials.append(material)
 bpy.ops.object.convert(target='MESH'); return bpy.context.object

cube('Garden island',(0,0,-.16),(25,7,.3),grass,.2)
cube('Neighbourhood footpath',(0,-1.6,.015),(24.6,1.25,.09),path)
for x in range(-12,13): cube('Paving joint',(x,-1.6,.065),(.012,1.2,.006),wood,0)
doors=[]
for i,x in enumerate(HOUSE_X):
 cube('House %d walls'%(i+1),(x,1.15,1.25),(2.8,2.25,2.5),plaster[i])
 # Two sloping roof planes with visible thickness.
 for side in [-1,1]:
  o=cube('Pitched tile roof',(x+side*.77,1.15,2.9),(1.88,2.65,.14),roof); o.rotation_euler[1]=side*math.radians(32)
  for j in range(9):
   o=cube('Roof tile seam',(x+side*.77,-.1+j*.31,2.98),(1.86,.025,.025),roof,.006); o.rotation_euler[1]=side*math.radians(32)
 cube('Chimney',(x+.85,1.6,3.12),(.35,.4,.8),plaster[i])
 cube('Door recess',(x,-.005,.9),(.8,.08,1.8),black)
 pivot=bpy.data.objects.new('Door %d hinge'%i,None); scene.collection.objects.link(pivot); pivot.location=(x-.38,-.08,0); bpy.context.view_layer.update()
 d=cube('Oak door',(x,-.08,.89),(.75,.09,1.76),wood); d.parent=pivot; d.matrix_parent_inverse=pivot.matrix_world.inverted(); doors.append(pivot)
 for wx in [-.93,.93]:
  cube('Window frame',(x+wx,-.02,1.42),(.65,.14,.83),trim)
  cube('Window glass',(x+wx,-.101,1.42),(.52,.025,.7),glass)
  cube('Window mullion',(x+wx,-.125,1.42),(.035,.03,.7),trim)
  cube('Window crossbar',(x+wx,-.125,1.42),(.52,.03,.035),trim)
 cube('Front step',(x,-.36,.1),(1.1,.62,.18),path)
 cube('Garden path',(x,-.75,.015),(.85,1.1,.08),path)
 label(str(i+1),(x,-.139,2.08),.2,trim)
 for sx in [-1.18,1.18]: sphere('Garden shrub',(x+sx,-.45,.26),(.27,.27,.32),grass)

# Each figure is a true armature with rigidly weighted mesh parts.
rigs=[]
for i in range(HOUSE_COUNT):
 arm=bpy.data.armatures.new('Stick figure skeleton'); rig=bpy.data.objects.new(('Cook rig' if i == 0 else 'Neighbour %d rig' % i),arm); scene.collection.objects.link(rig); bpy.context.view_layer.objects.active=rig; rig.select_set(True)
 bpy.ops.object.mode_set(mode='EDIT')
 specs={'body':((0,0,.83),(0,0,1.45),None),'head':((0,0,1.45),(0,0,1.85),'body'), 'arm.L':((-.25,0,1.4),(-.25,0,.88),'body'),'arm.R':((.25,0,1.4),(.25,0,.88),'body'),'leg.L':((-.13,0,.87),(-.13,0,.13),'body'),'leg.R':((.13,0,.87),(.13,0,.13),'body')}
 for name,(a,b,parent) in specs.items():
  bone=arm.edit_bones.new(name); bone.head=a; bone.tail=b
  if parent:bone.parent=arm.edit_bones[parent]
 bpy.ops.object.mode_set(mode='OBJECT'); rig.select_set(False)
 def bind(o,bone):
  bpy.context.view_layer.objects.active=o; o.select_set(True); bpy.ops.object.transform_apply(location=True,rotation=True,scale=True); o.select_set(False)
  group=o.vertex_groups.new(name=bone); group.add(list(range(len(o.data.vertices))),1,'REPLACE'); mod=o.modifiers.new('Stick figure rig','ARMATURE'); mod.object=rig; o.parent=rig
 bind(rod('Torso',(0,0,.87),(0,0,1.42),.115,colors[i]),'body')
 bind(sphere('Head',(0,0,1.66),(.19,.18,.21),colors[i]),'head')
 for eye in [-.065,.065]:bind(sphere('Eye',(eye,-.165,1.69),(.024,.018,.028),white),'head')
 for name in ['arm.L','arm.R','leg.L','leg.R']:
  a,b,_=specs[name]; bind(rod(name,a,b,.055,colors[i]),name); bind(sphere('Joint',a,(.077,)*3,black),name)
  if name.startswith('leg'):bind(sphere('Shoe',(b[0],-.07,.11),(.09,.17,.075),black),name)
  else:bind(sphere('Hand',b,(.072,)*3,colors[i]),name)
 if i==0:
  bind(sphere('Chef hat brim',(0,0,1.87),(.23,.21,.07),white),'head')
  for x in [-.1,0,.1]:bind(sphere('Chef hat puff',(x,0,1.98),(.13,.16,.13),white),'head')
 rigs.append(rig)

# The cook waits at the first neighbour; each subsequent neighbour asks next.
tracks=[]
for i,x in enumerate(HOUSE_X):
 if i==0:
  return_at=RETURN_START+(HOUSE_COUNT-2)*RETURN_SECONDS
  track=[(0,(x,-.6)),(1.5,(HOUSE_X[1]-.6,-1.65)),(return_at,(HOUSE_X[1]-.6,-1.65)),(DURATION,(x,-.6))]
 else:
  arrival=(i-1)*VISIT_SECONDS+1.5
  track=[(0,(x,.55)),(arrival,(x,.55)),(arrival+.5,(x+.35,-1.4))]
  if i<HOUSE_COUNT-1:
   leave=i*VISIT_SECONDS
   return_at=RETURN_START+(HOUSE_COUNT-2-i)*RETURN_SECONDS
   track += [(leave,(x+.35,-1.4)),(leave+1.5,(HOUSE_X[i+1]-.6,-1.65)),(return_at,(HOUSE_X[i+1]-.6,-1.65)),(return_at+RETURN_SECONDS,(x+.2,-1.6))]
  track += [(DURATION,track[-1][1])]
 tracks.append(track)

dialogue=[]
beats=[]
for i in range(1,HOUSE_COUNT):
 start=(i-1)*VISIT_SECONDS
 visitor='Cook' if i==1 else 'Neighbour %d'%(i-1)
 x=HOUSE_X[i]
 beats += [dict(at=start,caption=visitor+' walks to house %d.'%(i+1),speaker='',words='',x=x),dict(at=start+1.5,caption='Neighbour %d opens the door and comes outside.'%i,speaker='',words='',x=x)]
 phrases=[(2,3.3,visitor,'Do you have salt?',x-.6)]
 if i<HOUSE_COUNT-1:
  phrases += [(3.3,4.6,'Neighbour %d'%i,"No, I don't have any.",x+.35),(4.6,6,'Neighbour %d'%i,'Let me ask the next neighbour.',x+.35)]
 else:
  phrases += [(3.3,6,'Neighbour %d'%i,'Yes! Here is the salt.',x+.35)]
 for begin,end,speaker,words,bubble_x in phrases:
  dialogue.append((start+begin,start+end,bubble_x,words))
  beats.append(dict(at=round(start+begin,2),caption=('Salt found: the base case returns the result.' if i==HOUSE_COUNT-1 and begin==3.3 else speaker+': '+words),speaker=speaker,words=words,x=bubble_x))
for i in range(HOUSE_COUNT-2,-1,-1):
 start=RETURN_START+(HOUSE_COUNT-2-i)*RETURN_SECONDS
 beats.append(dict(at=round(start,2),caption=('The cook receives the salt and walks home.' if i==0 else 'Neighbour %d carries the salt back along the same path.'%i),speaker='',words='',x=HOUSE_X[i]))
beats.append(dict(at=DURATION,caption='Done. All five neighbours returned the salt unchanged, with no extra calculation.',speaker='',words='',x=HOUSE_X[0]))
metadata=dict(duration=DURATION,returnStart=RETURN_START,baseAt=(HOUSE_COUNT-2)*VISIT_SECONDS+3.3,houseCount=HOUSE_COUNT,tracks=tracks,beats=beats)
with open(os.path.join(ROOT,'src/features/courses/polytechnic/nd-it/design-and-analysis-of-algorithms/tailSaltTimeline.json'),'w') as f:json.dump(metadata,f,indent=2)
for beat in beats:scene.timeline_markers.new(beat['caption'][:60],frame=1+round(beat['at']*24))
def position(track,t):
 for (ta,a),(tb,b) in zip(track,track[1:]):
  if t<=tb:
   f=max(0,min(1,(t-ta)/(tb-ta))); return (a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f), (b[0]-a[0],b[1]-a[1]) if 0<f<1 else (0,0)
 return track[-1][1],(0,0)
for i,rig in enumerate(rigs):
 angle=0
 for frame in range(1,END_FRAME+1,3):
  t=(frame-1)/24; (x,y),(dx,dy)=position(tracks[i],t); walking=abs(dx)+abs(dy)>.001
  if walking:angle=math.atan2(dx,-dy)
  elif i==0 or (i<HOUSE_COUNT-1 and i*VISIT_SECONDS+1.5<=t<RETURN_START):angle=math.pi/2
  elif i>0:angle=-math.pi/2
  rig.location=(x,y,.03+(.035*abs(math.sin(t*10)) if walking else 0)); rig.rotation_euler[2]=angle
  rig.keyframe_insert('location',frame=frame); rig.keyframe_insert('rotation_euler',frame=frame)
  for j,name in enumerate(['arm.L','arm.R','leg.L','leg.R']):
   bone=rig.pose.bones[name]; bone.rotation_mode='XYZ'; bone.rotation_euler[0]=(math.sin(t*10)*(1 if j in [0,3] else -1)*.48) if walking else (.35 if name=='arm.R' and t>=RETURN_START-2 else 0); bone.keyframe_insert('rotation_euler',frame=frame)
for i,door in enumerate(doors):
 start=0 if i==0 else (i-1)*VISIT_SECONDS+1.5
 for t,angle in [(0,0),(start,0),(start+.6,-1.5),(start+1.2,-1.5),(start+2,0),(DURATION,0)]:door.rotation_euler[2]=angle; door.keyframe_insert('rotation_euler',frame=1+round(t*24))

salt=cube('SALT shaker',(0,0,0),(.19,.19,.3),white,.035)
lid=cube('Shaker metal lid',(0,0,.18),(.21,.21,.06),metal,.02); lid.parent=salt
text=label('SALT',(0,-.102,.01),.068,wood); text.parent=salt
for frame in range(1,END_FRAME+1,3):
 t=(frame-1)/24
 carrier=HOUSE_COUNT-1 if t<RETURN_START else max(0,HOUSE_COUNT-2-int((t-RETURN_START)/RETURN_SECONDS))
 (x,y),_=position(tracks[carrier],t)
 salt.location=(x-.2,y-.25,1.1); salt.scale=(1,1,1) if t>=RETURN_START-2 else (.001,)*3
 salt.keyframe_insert('location',frame=frame);salt.keyframe_insert('scale',frame=frame)

# Studio daylight; scene remains editable, and the web player supplies its own lights.
world=scene.world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.75,.83,.95,1);world.node_tree.nodes['Background'].inputs[1].default_value=.45
bpy.ops.object.light_add(type='AREA',location=(-3,-6,14));bpy.context.object.data.energy=2600;bpy.context.object.data.size=12
bpy.ops.object.camera_add(location=(9,-24,15));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,1))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=29;scene.camera=camera
scene.render.engine='CYCLES';scene.cycles.samples=16;scene.render.resolution_x=1400;scene.render.resolution_y=650;scene.render.resolution_percentage=100
# Camera-facing dialogue cards are editable and animated in Blender too.

for start,end,x,words in dialogue:
 holder=bpy.data.objects.new('Speech '+words,None);scene.collection.objects.link(holder);holder.location=(x,-1.5,3.5);holder.rotation_euler=camera.rotation_euler
 board=cube('Speech card',(0,0,0),(max(2.7,len(words)*.115),.65,.035),white,.1);board.parent=holder
 bpy.ops.object.text_add();txt=bpy.context.object;txt.name='Speech text';txt.data.body=words;txt.data.size=.2;txt.data.align_x='CENTER';txt.data.align_y='CENTER';txt.data.materials.append(black);txt.parent=holder;txt.location=(0,0,.03);bpy.ops.object.convert(target='MESH')
 for frame,scale in [(1,.001),(int(start*24),.001),(int(start*24)+1,1),(int(end*24),1),(int(end*24)+1,.001),(END_FRAME,.001)]:
  holder.scale=(scale,)*3;holder.keyframe_insert('scale',frame=frame)
scene.frame_set(1+round((RETURN_START-1)*24))
for area in bpy.context.screen.areas:
 if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA'
text=bpy.data.texts.get('generate_tail_salt.py') or bpy.data.texts.new('generate_tail_salt.py')
text.clear(); text.write(open(__file__).read())
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'artifacts/tail-salt/tail-salt.blend'))
bpy.ops.export_scene.gltf(export_animation_mode='SCENE', filepath=os.path.join(ROOT,'public/models/tail-salt.glb'),export_format='GLB',export_animations=True,export_frame_range=True,export_force_sampling=True,export_nla_strips=False,export_cameras=False,export_lights=False)
scene.render.filepath=os.path.join(ROOT,'artifacts/tail-salt/preview.png')
if os.environ.get('SALT_RENDER') == '1': bpy.ops.render.render(write_still=True)
