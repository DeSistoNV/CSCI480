''' converts .off file to vertex.js and faces.js '''
import sys

def split_and_rejoin(vert):
    splt = vert.split(" ")
    return "[" +  ",".join(splt)[:-1] + "],\n"

# fn = sys.argv[0]
# print fn
# n = sys.argv[1]

fn = '/home/nick/Documents/CSCI480/p3/meshes/bomber/m1296.off'
n = 'bomber'

with open(fn, 'r') as f:
    lines = f.readlines()[1:]

n_vertices = int(lines[0].split(" ")[0])
n_faces = int(lines[0].split(' ')[1])
vertices = lines[1:n_vertices+1]
faces = lines[n_vertices+1:n_vertices+1+n_faces]


js_vertices = "V = ["
for v in vertices:
    js_vertices += split_and_rejoin(v)

js_vertices = js_vertices[:-2] + "];"

with open("{}_vtx.js".format(n),"w") as f:
    f.write(js_vertices)
js_faces = "F = ["
for f in faces:
    js_faces += split_and_rejoin(f)
js_faces = js_faces[:-2] + "];"

with open("{}_fce.js".format(n),"w") as f:
    f.write(js_faces)
