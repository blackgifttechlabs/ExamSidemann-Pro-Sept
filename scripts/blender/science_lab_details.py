"""Additional independent apparatus and ceiling assets; executed by create_science_lab.py."""
begin_prop('ceiling')
ceiling_mat=material('Acoustic mineral ceiling',(.48,.50,.47),.94)
for x in range(10):
 for y in range(8):
  box('Ceiling acoustic tile',(-5.4+x*1.2,-4.375+y*1.25,.045),(1.18,1.23,.07),ceiling_mat,.008)
for x in range(11):box('Ceiling T rail',(-6+x*1.2,0,0),(.022,10,.035),edge,.003)
for y in range(9):box('Ceiling cross rail',(0,-5+y*1.25,0),(12,.022,.035),edge,.003)
for x in [-3,3]:
 for y in [-2.5,2.5]:
  box('Ceiling recessed light frame',(x,y,-.026),(1.16,.61,.06),steel,.012)
  box('Ceiling opal light panel',(x,y,-.061),(1.09,.54,.012),emission,.008)
for x in [-4.8,4.8]:
 box('Ceiling ventilation surround',(x,0,-.025),(.7,.65,.045),edge,.01)
 for j in range(10):box('Ceiling ventilation slot',(x,-.25+j*.055,-.05),(.56,.018,.012),black,.002)
begin_prop('water-volume')
cyl('Independent water volume',(0,0,.5),1,1,water,64)
begin_prop('water-surface')
lathe('Water surface meniscus',[(0,0),(.94,0),(.985,.012),(1,.035)],water,64)
begin_prop('boiling-bubble')
sphere('Rising water vapour bubble',(0,0,0),(1,1,1),glass)
begin_prop('burner-flame')
flame_mat=material('Blue flame',(.025,.18,.8),.3)
fbs=flame_mat.node_tree.nodes.get('Principled BSDF');fbs.inputs['Emission Color'].default_value=(.015,.15,1,1);fbs.inputs['Emission Strength'].default_value=1.8
lathe('Blue flame outer cone',[(0,0),(.012,.006),(.014,.023),(.009,.047),(0,.092)],flame_mat,24)
lathe('Pale inner cone',[(0,0),(.007,.005),(.006,.021),(0,.039)],emission,24)
begin_prop('steam-puff')
steam_mat=material('Condensed vapour mist',(.65,.69,.72),1)
bs=steam_mat.node_tree.nodes.get('Principled BSDF');bs.inputs['Alpha'].default_value=.075
steam_mat.diffuse_color=(.65,.69,.72,.075)
steam_mat.surface_render_method='DITHERED'
for i in range(4):sphere('Soft vapour lobe',(math.sin(i*2)*.28,math.cos(i*2)*.25,i*.12),( .55,.48,.48),steam_mat)
# Save each asset as an appendable Blender library as well as its web GLB.
os.makedirs(os.path.join(OUT,'props'),exist_ok=True)
for key,c in PROPS.items():bpy.data.libraries.write(os.path.join(OUT,'props',key+'.blend'),{c},fake_user=True,compress=True)
COL=lighting
