"""Articulated right hand and lab-coat sleeve. Left hand is mirrored by the runtime."""
import bpy,os,math
previous_scene=bpy.context.window.scene
source_path=os.path.join(os.path.dirname(__file__),'create_science_lab.py')
exec(compile(open(source_path).read().split('# Architecture:')[0],source_path,'exec'))
scene.name='First person laboratory hands'
COL=collection('ASSET • first-person-hands');COL.asset_mark()
skin=material('Deep brown skin',(.155,.061,.029),.58)
palm_skin=material('Warm palm skin',(.24,.105,.051),.65)
nail=material('Natural fingernails',(.29,.155,.104),.38)
coat=material('Cotton laboratory coat',(.72,.76,.73),.88)
seam=material('Cuff stitching',(.48,.53,.5),.95)
armature=bpy.data.armatures.new('Laboratory hand skeleton');rig=bpy.data.objects.new('Right hand rig',armature);COL.objects.link(rig)
bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
wrist=armature.edit_bones.new('wrist');wrist.head=(0,0,0);wrist.tail=(0,.085,0)
specs=[]
for name,x,length in [('index',-.033,.078),('middle',-.010,.088),('ring',.014,.082),('little',.035,.063)]:
 start=Vector((x,.092,0));parent=wrist
 for joint,fraction in enumerate([.45,.32,.23]):
  end=start+Vector((0,length*fraction,0));bone=armature.edit_bones.new('finger_'+name+'_'+str(joint));bone.head=start;bone.tail=end;bone.parent=parent
  specs.append((bone.name,start.copy(),end.copy(),.0105 if name!='little' else .0085,joint==2));start=end;parent=bone
start=Vector((-.04,.018,0));parent=wrist
for joint in range(3):
 end=start+Vector((-.018,.018,0));bone=armature.edit_bones.new('finger_thumb_'+str(joint));bone.head=start;bone.tail=end;bone.parent=parent
 specs.append((bone.name,start.copy(),end.copy(),.012-joint*.001,joint==2));parent=bone;start=end
bpy.ops.object.mode_set(mode='OBJECT')
meshes=[]
def bind(o,bone):
 if o.type!='MESH':
  bpy.ops.object.select_all(action='DESELECT');bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o=bpy.context.object
 group=o.vertex_groups.new(name=bone);group.add(list(range(len(o.data.vertices))),1,'REPLACE')
 modifier=o.modifiers.new('Finger articulation','ARMATURE');modifier.object=rig;o.parent=rig;meshes.append(o);return o
bind(sphere('Rounded dorsal palm',(0,.049,0),(.047,.063,.019),skin),'wrist')
bind(sphere('Palm pad',(0,.046,-.011),(.042,.054,.013),palm_skin),'wrist')
bind(sphere('Thumb muscle',(-.026,.025,-.006),(.025,.035,.019),skin),'wrist')
bind(rod('Wrist and forearm',(0,-.018,0),(0,-.12,-.009),.029,skin),'wrist')
bind(rod('White coat sleeve',(0,-.10,-.008),(0,-.155,-.012),.037,coat),'wrist')
bind(rod('Double stitched cuff',(0,-.098,-.008),(0,-.11,-.009),.038,seam),'wrist')
for name,start,end,r,tip in specs:
 mid=(start+end)/2;length=(end-start).length
 o=sphere('Anatomical '+name,mid,(r,length*.6,r*.83),skin)
 o.rotation_euler=(end-start).to_track_quat('Y','Z').to_euler();bind(o,name)
 bind(sphere('Knuckle '+name,start,(r*.94,r*.7,r*.79),skin),name)
 if tip:
  o=sphere('Nail '+name,mid+Vector((0,.002,r*.77)),(r*.62,length*.33,.0012),nail);o.rotation_euler=(end-start).to_track_quat('Y','Z').to_euler();bind(o,name)
# Subtle dorsal knuckle folds follow their phalanx, avoiding oversized knuckle balls.
crease=material('Natural joint creases',(.115,.041,.02),.8)
for name,start,end,r,tip in specs:
 if 'thumb' in name:continue
 for dy in [-.002,.002]:
  bind(tube('Knuckle fold',[(start.x-r*.55,start.y+dy,start.z+r*.77),(start.x,start.y+dy+.001,start.z+r*.82),(start.x+r*.55,start.y+dy,start.z+r*.77)],.00035,crease),name)
# Merge the weighted parts into one skinned mesh to keep two hands inexpensive on mobile.
bpy.ops.object.select_all(action='DESELECT')
for o in meshes:o.select_set(True)
bpy.context.view_layer.objects.active=meshes[0];bpy.ops.object.join();hand=bpy.context.object;hand.name='Articulated hand with individual fingers'
for polygon in hand.data.polygons:polygon.use_smooth=True
bpy.data.libraries.write(os.path.join(OUT,'props/first-person-hands.blend'),{COL},fake_user=True,compress=True)
bpy.ops.object.select_all(action='DESELECT');hand.select_set(True);rig.select_set(True)
with bpy.context.temp_override(scene=scene,view_layer=scene.view_layers[0]):
 bpy.ops.export_scene.gltf(filepath=os.path.join(WEB,'props/first-person-hands.glb'),export_format='GLB',use_selection=True,use_active_scene=True,export_animations=False,export_skins=True)
bpy.context.window.scene=previous_scene
print('Created articulated hand: 16 bones, skinned mesh, lab coat cuff')
