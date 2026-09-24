"""Reusable science classroom. Run in Blender 5.x, or its Python console.
All dimensions are metres. Builds a new scene without deleting existing scenes.
The prop collections are marked as assets; GLBs use standard PBR materials.
"""
import bpy, math, os, json, random
from mathutils import Vector, Matrix
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'../..'))
OUT=os.path.join(ROOT,'artifacts/science-lab'); WEB=os.path.join(ROOT,'public/models/science-lab')
random.seed(17)
scene=bpy.data.scenes.new('SCIENCE LAB | reusable classroom')
bpy.context.window.scene=scene
scene.unit_settings.system='METRIC';scene.unit_settings.scale_length=1
scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True
scene.render.resolution_x=1500;scene.render.resolution_y=1100;scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new('Lab daylight');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.65,.77,.91,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.16
scene.view_settings.view_transform='AgX'
COL=None
collections={}
def collection(name,linked=True):
 c=bpy.data.collections.new(name)
 if linked:scene.collection.children.link(c)
 collections[name]=c;return c
def move(o):
 for c in list(o.users_collection):c.objects.unlink(o)
 COL.objects.link(o);return o
architecture=collection('01 • Architecture');COL=architecture
furniture=collection('02 • Benches and seating');fixtures=collection('03 • Fixed services and storage');equipment=collection('04 • Placed laboratory equipment');decor=collection('05 • Wall learning resources');lighting=collection('06 • Lighting and cameras');cutaway=collection('07 • Optional front wall and ceiling')
materials={}
def material(name,color,rough=.5,metal=0,trans=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*color,1)
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Roughness'].default_value=rough;bs.inputs['Metallic'].default_value=metal;bs.inputs['Transmission Weight'].default_value=trans;bs.inputs['IOR'].default_value=1.46
 materials[name]=m;return m
ivory=material('Warm washable plaster',(.79,.81,.76),.85);teal=material('Sage powder coat',(.27,.42,.39),.42);edge=material('Off-white cabinet laminate',(.76,.79,.73),.45)
black=material('Charcoal phenolic resin',(.055,.07,.075),.34);steel=material('Brushed stainless steel',(.58,.64,.66),.28,.85);rubber=material('Dark rubber',(.028,.035,.038),.85)
wood=material('Birch plywood edges',(.54,.37,.2),.48);glass=material('Borosilicate clear glass',(.92,.98,1),.07,0,1);blue=material('Water sample blue',(.04,.42,.61),.18,0,.55)
water=material('Clear water',(.8,.95,.98),.08,0,.94);amber=material('Amber reagent glass',(.35,.13,.025),.15,0,.55);red=material('Safety red',(.65,.055,.035),.4)
white=material('Porcelain and labels',(.94,.94,.87),.28);yellow=material('Brass gas fittings',(.68,.43,.1),.28,.75);green=material('First aid green',(.08,.4,.23),.5);ink=material('Printed dark lettering',(.065,.12,.13),.7)
floor_mats=[material('Floor tile '+str(i),(.42+i*.016,.46+i*.016,.45+i*.016),.66) for i in range(3)]
# Fine surface detail in Blender, while keeping ordinary PBR values for glTF.
for m,scale,strength in [(black,190,.07),(ivory,100,.045),(wood,8,.12)]:
 n=m.node_tree.nodes;l=m.node_tree.links;noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=scale;bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=strength;bump.inputs['Distance'].default_value=.025;l.new(noise.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs['Normal'],n.get('Principled BSDF').inputs['Normal'])
def finish(o,name,mat):
 o.name=name
 if mat:o.data.materials.append(mat)
 return move(o)
def box(name,loc,size,mat,bevel=.015):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);finish(o,name,mat)
 if bevel:
  m=o.modifiers.new('Rounded manufactured edges','BEVEL');m.width=bevel;m.segments=2
  o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL')
 return o
def cyl(name,loc,r,depth,mat,vertices=32):
 bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc);o=bpy.context.object;finish(o,name,mat)
 bevel=o.modifiers.new('Edge rounding','BEVEL');bevel.width=min(.004,r*.09);bevel.segments=2
 for p in o.data.polygons:p.use_smooth=True
 return o
def sphere(name,loc,scale,mat):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=10,location=loc);o=bpy.context.object;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);finish(o,name,mat)
 for p in o.data.polygons:p.use_smooth=True
 return o
def rod(name,a,b,r,mat):
 a,b=Vector(a),Vector(b);o=cyl(name,(a+b)/2,r,(b-a).length,mat,16);o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();return o
def tube(name,points,r,mat):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=r;c.bevel_resolution=3;sp=c.splines.new('BEZIER');sp.bezier_points.add(len(points)-1)
 for p,co in zip(sp.bezier_points,points):p.co=co;p.handle_left_type='AUTO';p.handle_right_type='AUTO'
 o=bpy.data.objects.new(name,c);COL.objects.link(o);c.materials.append(mat);return o
def text(name,body,loc,size,mat=ink,rot=(math.pi/2,0,0),align='CENTER'):
 bpy.ops.object.text_add(location=loc,rotation=rot);o=bpy.context.object;o.name=name;o.data.body=body;o.data.size=size;o.data.align_x=align;o.data.extrude=.0003;o.data.materials.append(mat);move(o);return o
def lathe(name,profile,mat,segments=40):
 verts=[];faces=[]
 for r,z in profile:
  for i in range(segments):a=2*math.pi*i/segments;verts.append((r*math.cos(a),r*math.sin(a),z))
 for j in range(len(profile)-1):
  for i in range(segments):a=j*segments+i;b=j*segments+(i+1)%segments;faces.append((a,b,b+segments,a+segments))
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.materials.append(mat);o=bpy.data.objects.new(name,me);COL.objects.link(o)
 for p in me.polygons:p.use_smooth=True
 return o
def torus(name,loc,major,minor,mat):
 bpy.ops.mesh.primitive_torus_add(major_segments=32,minor_segments=8,location=loc,major_radius=major,minor_radius=minor);return finish(bpy.context.object,name,mat)

# Architecture: genuine window openings and tiled floor with recessed joints.
box('Floor slab',(0,0,-.11),(12.25,10.25,.2),edge)
verts=[];faces=[]
for ix in range(20):
 for iy in range(17):
  x=-6+ix*.6;y=-5+iy*(10/17);n=len(verts);dx=.595;dy=10/17-.005;verts += [(x,y,0),(x+dx,y,0),(x+dx,y+dy,0),(x,y+dy,0)];faces.append((n,n+1,n+2,n+3))
me=bpy.data.meshes.new('Resilient floor tiles');me.from_pydata(verts,[],faces)
for m in floor_mats:me.materials.append(m)
o=bpy.data.objects.new('Tiled floor • 600 mm module',me);COL.objects.link(o)
for face in me.polygons:face.material_index=random.randrange(3)
box('Rear wall',(0,5,1.85),(12.2,.18,3.7),ivory)
box('Window wall dado',(-6,0,.57),(.18,10,1.14),ivory)
box('Window wall lintel',(-6,0,3.27),(.18,10,.86),ivory)
for y in [-4.95,-1.6,1.6,4.95]:box('Window wall pier',(-6,y,1.94),(.18,.22,1.64),ivory)
for y in [-3.25,0,3.25]:
 box('Window sill',(-5.93,y,1.12),(.42,3.12,.065),white)
 box('Window glazing',(-5.985,y,2),(.015,3.03,1.65),glass,.002)
 for yy in [y-1.52,y,y+1.52]:box('Window aluminium upright',(-5.91,yy,2),(.085,.055,1.76),steel,.006)
 for z in [1.16,2.85]:box('Window aluminium rail',(-5.91,y,z),(.085,3.1,.055),steel,.006)
 box('Roller blind cassette',(-5.8,y,2.96),(.17,3.12,.15),edge)
 box('Partially lowered blind',(-5.84,y,2.72),(.025,3.02,.35),white,.005)
 tube('Blind pull cord',[(-5.76,y+1.38,2.87),(-5.76,y+1.38,2.1),(-5.76,y+1.32,2.05),(-5.76,y+1.32,2.87)],.004,white)
box('Back skirting',(0,4.88,.06),(12,.045,.12),teal,.004)
box('Window wall skirting',(-5.88,0,.06),(.045,10,.12),teal,.004)
# Complete room parts can be enabled for interior renders.
COL=cutaway
box('Front wall • enable for enclosed room',(0,-5,1.85),(12.2,.18,3.7),ivory)
box('Ceiling • enable for enclosed room',(0,0,3.78),(12.2,10.2,.12),ivory)
box('Right wall • enable for enclosed room',(6,0,1.85),(.18,10,3.7),ivory)
cutaway.hide_render=True;cutaway.hide_viewport=True

# Modular asset library; these collections are unlinked after their copies are placed.
PROPS={};placed=[]
def begin_prop(key):
 global COL
 COL=collection('ASSET • '+key);PROPS[key]=COL
 COL.asset_mark();COL.asset_data.description='Reusable science lab '+key+'; metric scale, origin on base.'
def place(key,name,loc,angle=0):
 root=bpy.data.objects.new(name,None);equipment.objects.link(root);root.location=loc;root.rotation_euler[2]=angle;root['asset_id']=key
 for original in PROPS[key].objects:
  o=original.copy();o.data=original.data;o.name=name+' / '+original.name;equipment.objects.link(o);o.parent=root
 placed.append(dict(name=name,asset=key,position=list(loc),rotation=angle));return root

def graduations(radius,height,count,label_value):
 for i in range(1,count+1):
  z=height*i/(count+1);box('Volume graduation',(-.018,-radius-.0008,z),(.028 if i%2 else .043,.001,.0015),white,.0003)
  if i%2==0:text('Volume marking',str(round(label_value*i/(count+1))),(.028,-radius-.002,z-.005),.012,white)

begin_prop('beaker-250ml')
lathe('Thick-walled open beaker',[(0,0),(.037,0),(.041,.004),(.041,.098),(.043,.1),(.038,.1),(.037,.009),(0,.009)],glass)
torus('Rolled beaker lip',(0,0,.1),.04,.0025,glass)
graduations(.041,.098,6,250);text('Capacity','250 ml',(0,-.042,.083),.011,white)
begin_prop('beaker-blue-sample')
for o in PROPS['beaker-250ml'].objects:
 c=o.copy();c.data=o.data;COL.objects.link(c)
cyl('Blue sample',(0,0,.032),.035,.046,blue);torus('Liquid meniscus',(0,0,.056),.0338,.0012,blue)
begin_prop('test-tube')
lathe('Rounded bottom open test tube',[(0,.004),(.004,.001),(.008,.004),(.01,.012),(.01,.145),(.008,.145),(.008,.015),(.005,.008),(0,.008)],glass,28);torus('Test tube rolled rim',(0,0,.145),.009,.0012,glass)
begin_prop('test-tube-rack')
box('Rack bottom',(0,0,.01),(.28,.09,.02),wood,.006)
# Twin rails keep the openings visibly open instead of intersecting glass.
for y in [-.028,.028]:box('Rack top rail',(0,y,.094),(.28,.015,.012),wood,.003)
for x in [-.132,.132]:box('Rack end upright',(x,0,.055),(.015,.09,.105),wood,.004)
for i in range(6):
 x=-.105+i*.042;torus('Tube support collar',(x,0,.095),.013,.0025,steel)
 for source in PROPS['test-tube'].objects:
  o=source.copy();o.data=source.data;COL.objects.link(o);o.location.x+=x;o.location.z+=.02
 if i<4:cyl('Sample in tube',(x,0,.055),.0072,.053,blue if i%2 else water,20)
begin_prop('bunsen-burner')
cyl('Weighted burner base',(0,0,.009),.043,.018,black)
cyl('Brass mixing body',(0,0,.035),.013,.044,yellow)
cyl('Burner barrel',(0,0,.097),.009,.096,steel)
lathe('Open burner nozzle',[(.01,.14),(.01,.153),(.007,.153),(.007,.14)],steel,24)
for x in [-1,1]:sphere('Air intake',(.012*x,0,.04),(.001,.005,.008),rubber)
rod('Gas hose barb',(0,0,.026),(.043,0,.026),.0045,yellow)
tube('Disconnected rubber hose',[(.043,0,.026),(.08,.02,.014),(.12,.12,.012),(.21,.14,.012),(.25,.07,.012)],.0055,rubber)
begin_prop('conical-flask')
lathe('Erlenmeyer flask',[(0,0),(.049,0),(.052,.008),(.05,.026),(.017,.103),(.017,.15),(.014,.15),(.014,.105),(.045,.025),(.045,.008),(0,.008)],glass)
torus('Flask lip',(0,0,.15),.016,.002,glass);graduations(.05,.065,3,250)
begin_prop('measuring-cylinder')
cyl('Cylinder hexagonal base',(0,0,.005),.032,.01,white,6)
lathe('Graduated cylinder',[(0,.01),(.013,.01),(.013,.21),(.014,.215),(.011,.215),(.011,.015),(0,.015)],glass,32);graduations(.013,.205,12,100)
begin_prop('reagent-bottle')
lathe('Amber bottle',[(0,0),(.026,0),(.029,.005),(.029,.081),(.018,.097),(.014,.104),(.014,.125),(.011,.125),(.011,.103),(.025,.079),(.025,.006),(0,.006)],amber)
cyl('Screw cap',(0,0,.13),.017,.017,black)
box('Bottle paper label',(0,-.029,.054),(.04,.001,.04),white,.001)
text('Bottle label','SAMPLE\nA',(0,-.030,.063),.009,ink)
begin_prop('wash-bottle')
lathe('Wash bottle body',[(0,0),(.032,0),(.034,.015),(.034,.13),(.02,.15),(.02,.16),(0,.16)],white)
cyl('Blue cap',(0,0,.164),.022,.015,blue)
tube('Wash bottle spout',[(0,0,.17),(.02,0,.23),(.055,0,.235),(.09,0,.205)],.004,white)
text('Wash label','DISTILLED\nWATER',(0,-.034,.085),.009,ink)
begin_prop('tripod-gauze')
for a in [0,120,240]:
 r=math.radians(a);rod('Tripod leg',(.056*math.cos(r),.056*math.sin(r),.003),(.04*math.cos(r),.04*math.sin(r),.14),.004,steel)
torus('Tripod top',(0,0,.14),.043,.004,steel)
for j in range(11):
 v=-.05+j*.01;rod('Wire gauze',(v,-.05,.147),(v,.05,.147),.00065,steel);rod('Wire gauze',(-.05,v,.147),(.05,v,.147),.00065,steel)
cyl('Ceramic gauze centre',(0,0,.149),.026,.002,white)
begin_prop('retort-stand')
box('Retort stand base',(0,0,.012),(.18,.12,.024),black,.012);rod('Retort upright',(.055,.03,.02),(.055,.03,.49),.005,steel)
box('Boss head',(.055,.03,.33),(.029,.027,.022),yellow,.003);rod('Clamp arm',(.055,.03,.33),(-.055,.03,.33),.0035,steel)
tube('Clamp jaw',[(-.055,.03,.33),(-.085,.02,.33),(-.09,-.005,.33)],.003,rubber)
tube('Clamp jaw',[(-.055,.03,.33),(-.035,.02,.33),(-.03,-.005,.33)],.003,rubber)
begin_prop('petri-dish')
lathe('Petri dish',[(0,0),(.045,0),(.045,.013),(.043,.013),(.043,.002),(0,.002)],glass)
lathe('Petri lid',[(0,.015),(.047,.015),(.047,.004),(.045,.004),(.045,.013),(0,.013)],glass)
begin_prop('safety-goggles')
for x in [-.037,.037]:
 lens=sphere('Goggle lens',(x,0,.025),(.034,.016,.024),glass)
 tube('Goggle frame',[(x-.03,0,.025),(x-.02,0,.047),(x+.02,0,.047),(x+.033,0,.022),(x+.02,0,.006),(x-.02,0,.006),(x-.03,0,.025)],.003,teal)
tube('Elastic strap',[(-.07,0,.025),(-.066,.075,.025),(.066,.075,.025),(.07,0,.025)],.004,rubber)
begin_prop('digital-balance')
box('Balance body',(0,0,.025),(.19,.23,.05),white,.018);cyl('Stainless weighing pan',(0,.03,.062),.075,.012,steel)
box('Display surround',(0,-.087,.052),(.1,.04,.005),rubber,.003);text('Digital readout','0.00 g',(0,-.096,.056),.015,green,rot=(0,0,0))
begin_prop('microscope')
box('Microscope weighted foot',(0,0,.025),(.19,.24,.05),white,.025)
tube('Curved microscope arm',[(0,.07,.05),(0,.09,.18),(0,.045,.31),(0,-.015,.34)],.026,white)
box('Specimen stage',(0,-.025,.17),(.145,.12,.012),black,.004)
for x in [-.04,.04]:rod('Stage clip',(x,-.065,.18),(x,.005,.18),.002,steel)
cyl('Illuminator',(0,-.025,.077),.027,.032,steel)
body=rod('Optical tube',(0,-.015,.31),(0,-.07,.4),.019,white)
rod('Eyepiece',(0,-.07,.4),(0,-.096,.435),.014,rubber)
cyl('Objective turret',(0,-.025,.265),.03,.015,steel)
for x,y in [(-.015,-.035),(.015,-.035),(0,-.01)]:rod('Objective lens',(x,y,.26),(x,y,.215),.007,steel)
for x in [-.041,.041]:
 o=cyl('Focus knob',(x,.065,.2),.023,.016,rubber);o.rotation_euler[1]=math.pi/2
begin_prop('lab-stool')
cyl('Round stool seat',(0,0,.62),.17,.055,teal)
for a in [45,135,225,315]:
 r=math.radians(a);rod('Stool leg',(.14*math.cos(r),.14*math.sin(r),.59),(.2*math.cos(r),.2*math.sin(r),.035),.014,steel);sphere('Stool foot',(.2*math.cos(r),.2*math.sin(r),.025),(.023,.023,.025),rubber)
torus('Stool foot ring',(0,0,.24),.18,.009,steel)
begin_prop('lab-notebook')
box('Notebook cover',(0,0,.009),(.16,.22,.018),teal,.003);box('Notebook pages',(0,0,.013),(.153,.21,.012),white,.001);text('Notebook title','LAB NOTES',(0,-.02,.021),.017,ink,rot=(0,0,0));rod('Pencil',(.105,-.1,.008),(.105,.09,.008),.003,yellow)

# Four student workstations, with uncluttered working areas and built-in services.
COL=furniture
bench_positions=[(-2.75,-2.4),(1.4,-2.4),(-2.75,1.1),(1.4,1.1)]
for i,(x,y) in enumerate(bench_positions):
 name='Workstation %02d'%(i+1)
 box(name+' resin worktop',(x,y,.925),(2.9,1.35,.065),black,.025)
 box(name+' plywood substrate',(x,y,.88),(2.82,1.27,.028),wood,.007)
 for xx in [-1.27,1.27]:
  for yy in [-.49,.49]:
   box(name+' steel leg',(x+xx,y+yy,.445),(.055,.055,.87),teal,.009);box(name+' adjustable foot',(x+xx,y+yy,.024),(.075,.075,.045),rubber,.012)
 for yy in [-.49,.49]:box(name+' long apron',(x,y+yy,.79),(2.58,.04,.12),teal,.004)
 box(name+' drawer cabinet',(x-.89,y,.55),(.72,1.03,.61),edge,.015)
 for z in [.38,.58,.78]:
  box(name+' drawer front',(x-.89,y-.53,z),(.68,.035,.175),teal,.008);rod(name+' pull',(x-1.03,y-.562,z),(x-.75,y-.562,z),.008,steel)
 text(name+' ID','STATION %02d'%(i+1),(x+.55,y-.681,.916),.034,white)
 # A raised service block at the far edge, away from student knees.
 box(name+' service block',(x+.98,y+.43,1.015),(.48,.23,.12),edge,.013)
 for xx in [.86,1.08]:
  box('Electrical outlet plate',(x+xx,y+.31,1.014),(.075,.008,.073),white,.005)
  for offset in [-.016,.016]:box('Outlet slot',(x+xx+offset,y+.304,1.02),(.006,.002,.018),black,.001)
 rod('Gas service riser',(x+.56,y+.44,.96),(x+.56,y+.44,1.08),.009,yellow)
 rod('Gas tap spout',(x+.56,y+.44,1.06),(x+.64,y+.44,1.06),.006,yellow);box('Gas tap handle',(x+.56,y+.44,1.09),(.055,.025,.015),yellow,.004)
 z=.959
 place('test-tube-rack',name+' / test tube rack',(x-.38,y+.35,z))
 place('beaker-blue-sample',name+' / blue sample',(x+.12,y+.25,z))
 place('beaker-250ml',name+' / clean beaker',(x+.34,y+.3,z))
 place('conical-flask',name+' / flask',(x-.03,y+.43,z))
 place('measuring-cylinder',name+' / graduated cylinder',(x-.61,y+.39,z))
 place('bunsen-burner',name+' / burner',(x+.55,y-.06,z))
 place('tripod-gauze',name+' / tripod',(x+.86,y+.035,z))
 place('safety-goggles',name+' / eye protection',(x-1.05,y-.27,z),-.15)
 place('lab-notebook',name+' / notebook',(x-.45,y-.25,z),-.08)
 if i%2==0:place('microscope',name+' / microscope',(x-1.06,y+.22,z),.2)
 else:place('digital-balance',name+' / balance',(x-1.03,y+.2,z))
 for xx in [-.55,.55]:place('lab-stool',name+' / stool',(x+xx,y-1.0,0))

# Rear preparation bench with real recessed sinks (no countertop across bowls).
COL=fixtures
for x in [-4.95,-3.85,-2.75,-1.65,-.55,.55,1.65,2.75]:
 box('Preparation base cabinet',(x,4.38,.44),(1.06,1.0,.87),edge)
 for dx in [-.265,.265]:
  box('Cabinet door',(x+dx,3.864,.455),(.515,.035,.76),teal,.008);rod('Cabinet handle',(x+dx+.16,3.825,.53),(x+dx+.16,3.825,.68),.006,steel)
for a,b in [(-5.5,-4.75),(-4.15,-2.45),(-1.85,3.3)]:box('Prep counter resin',( (a+b)/2,4.32,.924),(b-a,1.17,.065),black)
for x in [-4.45,-2.15]:
 for yy in [3.91,4.77]:box('Sink counter edge',(x,yy,.924),(.6,.35,.065),black,.005)
 box('Sink bottom',(x,4.34,.71),(.56,.52,.035),steel,.04)
 for xx in [-.29,.29]:box('Sink side',(x+xx,4.34,.81),(.025,.56,.22),steel,.008)
 for yy in [-.27,.27]:box('Sink end',(x,4.34+yy,.81),(.6,.025,.22),steel,.008)
 cyl('Sink drain',(x,4.34,.733),.034,.004,black)
 tube('Gooseneck mixer tap',[(x,4.78,.96),(x,4.78,1.24),(x,4.69,1.31),(x,4.4,1.31),(x,4.36,1.23)],.014,steel)
 for dx in [-.1,.1]:cyl('Tap control',(x+dx,4.78,.98),.027,.025,steel)
# Glass-front upper cabinets.
for x in [-4.35,-2.55]:
 box('Upper cabinet back',(x,4.84,2.05),(1.5,.08,1.22),edge)
 for dx in [-.76,.76]:box('Upper cabinet side',(x+dx,4.64,2.05),(.04,.47,1.22),edge)
 for z in [1.45,1.85,2.25,2.65]:box('Upper cabinet shelf',(x,4.62,z),(1.52,.5,.03),edge)
 for dx in [-.38,.38]:
  box('Glazed cabinet door',(x+dx,4.36,2.05),(.72,.015,1.15),glass,.003)
  rod('Cabinet glazed door handle',(x+dx+.25,4.325,1.96),(x+dx+.25,4.325,2.12),.007,steel)
 for row,z in enumerate([1.47,1.87,2.27]):
  for j in range(6):place('reagent-bottle','Stored reagent bottle',(x-.55+j*.22,4.6,z))
for x in [-.95,.35,1.65]:
 place('wash-bottle','Prep wash bottle',(x,4.36,.96))
 place('beaker-250ml','Prep clean beaker',(x+.22,4.35,.96))
place('retort-stand','Prep retort stand',(2.8,4.3,.96))
place('digital-balance','Preparation balance',(1.95,4.3,.96))
# Drying rack on wall.
for x in [-.65,-.3,.05,.4]:
 for z in [1.35,1.6,1.85]:rod('Drying rack peg',(x,4.9,z),(x,4.63,z+.1),.007,teal)
box('Drying rack back',(-.125,4.93,1.62),(1.4,.05,.8),white)
# Fume cupboard, in rear-right corner; sash stays partially raised.
box('Fume cupboard base',(4.7,4.25,.46),(1.75,1.4,.92),edge)
box('Fume cupboard work surface',(4.7,4.25,.95),(1.8,1.45,.07),black)
for x in [3.82,5.58]:box('Fume cupboard side',(x,4.3,1.82),(.075,1.45,1.74),edge)
box('Fume cupboard rear',(4.7,4.94,1.82),(1.8,.07,1.74),white)
box('Fume cupboard hood',(4.7,4.25,2.7),(1.8,1.45,.2),teal)
box('Raised glass sash',(4.7,3.565,2.11),(1.58,.018,.95),glass,.003)
box('Sash handle',(4.7,3.545,1.63),(1.63,.055,.035),steel,.006)
cyl('Extraction duct',(4.7,4.45,3.12),.18,.65,steel)
text('Fume cupboard label','FUME CUPBOARD',(4.7,3.505,2.69),.075,white)
place('conical-flask','Fume hood flask',(4.4,4.16,1.0));place('beaker-250ml','Fume hood beaker',(4.8,4.2,1.0))
# Mobile utility trolley at the side.
for z in [.22,.8]:box('Trolley tray',(4.9,.85,z),(1.05,.6,.045),steel)
for x in [4.42,5.38]:
 for y in [.6,1.1]:
  rod('Trolley upright',(x,y,.1),(x,y,.95),.017,steel);o=cyl('Trolley caster',(x,y,.085),.065,.035,rubber,20);o.rotation_euler[1]=math.pi/2
place('test-tube-rack','Trolley test tubes',(4.65,.85,.83));place('wash-bottle','Trolley wash bottle',(5.05,.83,.83));place('petri-dish','Trolley petri dish',(5.23,.82,.83))
# Safety fixtures, waste containers, clock, and personal protective equipment.
box('First aid cabinet',(5.25,4.865,3.18),(.56,.13,.4),white)
box('First aid green cross vertical',(5.25,4.79,3.18),(.08,.01,.26),green,.002);box('First aid green cross horizontal',(5.25,4.78,3.18),(.26,.01,.08),green,.002)
for x,mat,name in [(4.9,teal,'General waste'),(5.65,yellow,'Broken glass')]:
 cyl(name+' bin',(x,-2.7,.28),.22,.54,mat);cyl(name+' lid',(x,-2.7,.565),.235,.04,black);text(name+' label',name.upper().replace(' ','\n'),(x,-2.923,.33),.042,white)
COL=decor
# Poster maps are packed into the blend and embedded in glTF.
def poster(name,filename,center,width,height):
 x,y,z=center;box(name+' frame',(x,y+.025,z),(width+.07,.065,height+.07),teal,.012)
 m=material(name+' print',(1,1,1),.9);image=bpy.data.images.load(os.path.join(OUT,'textures',filename));image.pack();nodes=m.node_tree.nodes;tex=nodes.new('ShaderNodeTexImage');tex.image=image;m.node_tree.links.new(tex.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color'])
 bpy.ops.mesh.primitive_plane_add(size=1,location=(x,y-.012,z),rotation=(math.pi/2,0,0));o=bpy.context.object;o.scale=(width,height,1);finish(o,name,m)
poster('Periodic table','periodic-table.png',(1.88,4.86,2.28),2.15,1.43)
# Freestanding teaching/display board near the open front edge, facing the room's entrance.
for x in [-4.95,-3.1]:rod('Display board upright',(x,-4.72,.05),(x,-4.72,2.8),.018,steel)
poster('Lab practice','lab-practice.png',(-4.02,-4.72,2.07),1.8,1.2)
# Two wall panels on the right rear return, retained in cutaway view.
COL=architecture;box('Right rear display wall',(6,3.2,1.85),(.18,3.6,3.7),ivory)
COL=decor
# Create posters in their default front-facing plane, then rotate the full assembly onto the side wall.
for name,file,y in [('Scientific method','scientific-method.png',2.25),('Atomic model','atom-model.png',4.1)]:
 before=set(COL.objects);poster(name,file,(0,0,0),1.45,.97)
 pivot=bpy.data.objects.new(name+' wall mount',None);COL.objects.link(pivot);pivot.location=(5.88,y,2.2);pivot.rotation_euler[2]=-math.pi/2
 for o in set(COL.objects)-before-{pivot}:o.parent=pivot
# Analog clock on the rear wall.
o=cyl('Clock bezel',(-.8,4.82,3.14),.22,.045,steel);o.rotation_euler[0]=math.pi/2
o=cyl('Clock dial',(-.8,4.789,3.14),.198,.006,white);o.rotation_euler[0]=math.pi/2
for i in range(12):
 a=2*math.pi*i/12;sphere('Clock index',(-.8+.17*math.sin(a),4.782,3.14+.17*math.cos(a)),(.006,.003,.006),ink)
rod('Clock minute hand',(-.8,4.774,3.14),(-.8+.13,4.774,3.14+.07),.004,ink);rod('Clock hour hand',(-.8,4.771,3.14),(-.8-.07,4.771,3.14+.055),.006,ink)
text('Room title','SCIENCE LABORATORY',(1.9,4.865,3.37),.115,teal)

# Lighting and three reusable cameras.
COL=lighting
emission=material('LED diffuser',(.94,.98,1),.25);bs=emission.node_tree.nodes.get('Principled BSDF');bs.inputs['Emission Color'].default_value=(.9,.96,1,1);bs.inputs['Emission Strength'].default_value=.65
for x in [-3,1.6]:
 for y in [-2.4,1.2]:
  box('Suspended LED housing',(x,y,3.4),(1.7,.32,.07),edge)
  box('LED diffuser',(x,y,3.36),(1.6,.26,.012),emission)
  for dx in [-.65,.65]:rod('Luminaire suspension',(x+dx,y,3.44),(x+dx,y,3.72),.003,steel)
  bpy.ops.object.light_add(type='AREA',location=(x,y,3.32));o=bpy.context.object;o.name='Bench soft light';o.data.energy=55;o.data.shape='RECTANGLE';o.data.size=1.6;o.data.size_y=.3;move(o)
for y in [-3.25,0,3.25]:
 bpy.ops.object.light_add(type='AREA',location=(-5.7,y,2.25));o=bpy.context.object;o.name='Window daylight';o.data.energy=180;o.data.shape='RECTANGLE';o.data.size=2.8;o.data.size_y=1.6;o.rotation_euler=(Vector((0,y,1))-o.location).to_track_quat('-Z','Y').to_euler();move(o)
bpy.ops.object.light_add(type='AREA',location=(2,-4,7));o=bpy.context.object;o.name='Open-side soft fill';o.data.energy=350;o.data.size=7;o.rotation_euler=(Vector((0,1,0))-o.location).to_track_quat('-Z','Y').to_euler();move(o)
bpy.ops.object.light_add(type='SUN',location=(-6,-4,8));o=bpy.context.object;o.name='Late morning sun';o.data.energy=.65;o.data.angle=.08;o.rotation_euler=(math.radians(24),math.radians(-28),math.radians(-48));move(o)
def camera(name,loc,target,lens):
 bpy.ops.object.camera_add(location=loc);o=bpy.context.object;o.name=name;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();o.data.lens=lens;o.data.clip_start=.03;o.data.clip_end=200;move(o);return o
hero=camera('Camera • classroom overview',(13,-17,12.2),(0,.7,1),43)
interior=camera('Camera • student eye level',(4.8,-4.6,1.65),(-1.2,2.8,1.25),24)
close=camera('Camera • bench apparatus',(-.2,-4.4,2.45),(-2.4,-2.25,1.03),52)
scene.camera=hero
exec(compile(open(os.path.join(os.path.dirname(__file__),'science_lab_details.py')).read(), 'science_lab_details.py', 'exec'))
# Asset collections remain in the .blend, but do not render at the origin.
for c in PROPS.values():scene.collection.children.unlink(c)
for area in bpy.context.screen.areas:
 if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA'
scene['description']='Metric reusable school science laboratory. Four student benches, preparation counter, three windows, fume cupboard, independent apparatus assets.'
scene['bench_surface_m']=.9575
scene['room_dimensions_m']=[12,10,3.7]
scene['reuse']='Append ASSET collections, or use public/models/science-lab/props/*.glb. Enable optional room collection for enclosed views.'
# Embed the generator for future editing.
source=bpy.data.texts.new('create_science_lab.py');source.write(open(__file__).read())
bpy.ops.object.select_all(action='DESELECT')
# Save an ordinary project with this lab active (so opening it never shows an empty scene).
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'science-lab.blend'),compress=True)
# Export visible geometry, retaining useful object names and property metadata.
for obj in scene.objects:
 obj.select_set(obj.type in {'MESH','CURVE','FONT','EMPTY'} and not any(c==cutaway for c in obj.users_collection))
bpy.ops.export_scene.gltf(filepath=os.path.join(WEB,'science-lab.glb'),export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_animations=False,export_cameras=False,export_lights=False,export_extras=True)
# Individual origin-based asset exports.
for key,c in PROPS.items():
 bpy.ops.object.select_all(action='DESELECT');scene.collection.children.link(c)
 for obj in c.objects:obj.select_set(True)
 bpy.ops.export_scene.gltf(filepath=os.path.join(WEB,'props',key+'.glb'),export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_animations=False,export_extras=True)
 scene.collection.children.unlink(c)
with open(os.path.join(WEB,'manifest.json'),'w') as f:json.dump(dict(name='Reusable science laboratory',units='metres',blender_up_axis='Z',gltf_up_axis='Y',room_dimensions=[12,10,3.7],bench_surface=.9575,props=list(PROPS),placements=placed,cameras=['overview','student-eye','bench-apparatus']),f,indent=2)
scene.render.filepath=os.path.join(OUT,'overview.png')
print('SCIENCE LAB READY:',len(scene.objects),'scene objects;',len(PROPS),'reusable props;',len(placed),'placements')

# The reusable project opens as an enclosed room; the web uses the separately exported ceiling.
ceiling_instance=bpy.data.objects.new('Finished acoustic ceiling',None)
scene.collection.objects.link(ceiling_instance)
ceiling_instance.instance_type='COLLECTION';ceiling_instance.instance_collection=PROPS['ceiling'];ceiling_instance.location.z=3.7
scene.camera=interior
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'science-lab.blend'),compress=True)
