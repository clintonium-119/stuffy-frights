import sys, numpy as np, trimesh
src, dst = sys.argv[1], sys.argv[2]
m = trimesh.load(src, force='mesh')
V, F = np.asarray(m.vertices), np.asarray(m.faces)
print("loaded faces", len(F), "verts", len(V))
# --- connected components via union-find over edges (numpy, no scipy) ---
parent = np.arange(len(V))
def find(x):
    root = x
    while parent[root] != root: root = parent[root]
    while parent[x] != root: parent[x], x = root, parent[x]
    return root
e = m.edges_unique
for a, b in e.tolist():
    ra, rb = find(a), find(b)
    if ra != rb: parent[ra] = rb
labels = np.array([find(i) for i in range(len(V))])
uniq, counts = np.unique(labels, return_counts=True)
biggest = uniq[counts.argmax()]
keepv = labels == biggest
fmask = keepv[F].all(axis=1)
print("components", len(uniq), "-> keep largest, faces", int(fmask.sum()), "of", len(F))
m.update_faces(fmask); m.remove_unreferenced_vertices()
# --- Taubin smoothing (numpy) ---
V = np.asarray(m.vertices).copy(); e = m.edges_unique
for _ in range(12):
    for f in (0.5, -0.53):
        s = np.zeros_like(V); c = np.zeros(len(V))
        np.add.at(s, e[:,0], V[e[:,1]]); np.add.at(s, e[:,1], V[e[:,0]])
        np.add.at(c, e[:,0], 1.0); np.add.at(c, e[:,1], 1.0); c[c==0]=1
        V = V + f*((s/c[:,None]) - V)
m.vertices = V
m.export(dst)
print("exported", dst, "faces", len(m.faces))
