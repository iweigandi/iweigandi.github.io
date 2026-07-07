import osmnx as ox
import networkx as nx
import geopandas as gpd
import matplotlib.pyplot as plt
from shapely.affinity import rotate
from shapely.geometry import Point
import sys

# Force utf-8 to avoid console encoding errors on Windows
sys.stdout.reconfigure(encoding='utf-8')

place = "Ciudad Evita, La Matanza, Argentina"
ox.settings.log_console = False # Suppress tqdm output
G_uns = ox.graph_from_place(place, network_type="drive", simplify=False)
G_nd = nx.Graph(G_uns)

cycles = nx.cycle_basis(G_nd)
dead_cycles = [
    c for c in cycles 
    if len({nb for n in c for nb in G_nd.neighbors(n) if nb not in c}) == 1
]

streets_per_node = ox.stats.count_streets_per_node(G_uns)
cul_nodes = {n for n, cnt in streets_per_node.items() if cnt == 1}

edges_uns = ox.graph_to_gdfs(G_uns, nodes=False, edges=True).reset_index()
edges_uns['uv'] = edges_uns.apply(lambda r: tuple(sorted((r['u'], r['v']))), axis=1)

loop_geoms = [
    edges_uns.loc[edges_uns['uv'] == tuple(sorted((u, v))), 'geometry'].iloc[0]
    for cyc in dead_cycles for u, v in zip(cyc, cyc[1:] + [cyc[0]])
]
cycle_gs = gpd.GeoSeries(loop_geoms, crs="EPSG:4326")

pts = gpd.GeoSeries(
    [Point(G_uns.nodes[n]['x'], G_uns.nodes[n]['y']) for n in cul_nodes], 
    crs="EPSG:4326"
)

rotation_angle = 220
area = ox.geocode_to_gdf(place)
ctr = area.geometry.centroid.iloc[0]

all_edges = edges_uns.drop_duplicates(subset='uv').set_geometry('geometry')
all_rot = all_edges.geometry.apply(lambda g: rotate(g, rotation_angle, origin=(ctr.x, ctr.y)))
cycle_rot = cycle_gs.apply(lambda g: rotate(g, rotation_angle, origin=(ctr.x, ctr.y)))
pts_rot = pts.apply(lambda p: rotate(p, rotation_angle, origin=(ctr.x, ctr.y)))

fig, ax = plt.subplots(figsize=(10, 10))
all_rot.plot(ax=ax, linewidth=1, color='gray', alpha=0.5, label='All streets')
cycle_rot.plot(ax=ax, linewidth=3, color='red', label='Roundabout loops')
pts_rot.plot(ax=ax, markersize=30, color='purple', label='Cul-de-sac roots')

ax.set_aspect('equal')
ax.axis('off')
ax.legend(loc='upper left', frameon=False)
ax.set_title("Ciudad Evita Street Network", fontsize=16)

plt.savefig("map.png", bbox_inches='tight', dpi=300)
print("Map successfully generated as map.png")
