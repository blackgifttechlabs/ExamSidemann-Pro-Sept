import React, { useMemo, useState } from 'react';
import {
  Chip, DemoCard, EState, GEdge, Graph, GraphPlayer, GraphStyles, NState, Step,
  edgeKey, findEdge, joinWords, neighbours, useOnScreen,
} from './GraphEngine';

// ──────────────────────────────────────────────────────────────────────────────
// Shared graphs
// ──────────────────────────────────────────────────────────────────────────────
const n = (id: string, x: number, y: number, name?: string) => ({ id, x, y, name });
const u = (a: string, b: string, w?: number): GEdge => ({ a, b, w });
const d = (a: string, b: string, w?: number): GEdge => ({ a, b, w, directed: true });

// Small undirected graph used for BFS / DFS
const SEARCH_GRAPH: Graph = {
  w: 440, h: 190,
  nodes: [n('A', 220, 28), n('B', 120, 85), n('C', 320, 85), n('D', 70, 150), n('E', 170, 150), n('F', 270, 150), n('G', 370, 150)],
  edges: [u('A', 'B'), u('A', 'C'), u('B', 'D'), u('B', 'E'), u('C', 'F'), u('C', 'G'), u('E', 'F')],
};

// The classic 9-vertex weighted graph (used for Dijkstra and for the MSTs)
const WEIGHTED_GRAPH: Graph = {
  w: 460, h: 235,
  nodes: [
    n('0', 50, 80), n('1', 150, 30), n('2', 250, 80), n('3', 350, 30), n('4', 410, 150),
    n('5', 300, 200), n('6', 150, 200), n('7', 50, 150), n('8', 200, 130),
  ],
  edges: [
    u('0', '1', 4), u('0', '7', 8), u('1', '2', 8), u('1', '7', 11), u('2', '3', 7), u('2', '5', 4),
    u('2', '8', 2), u('3', '4', 9), u('3', '5', 14), u('4', '5', 10), u('5', '6', 2), u('6', '7', 1),
    u('6', '8', 6), u('7', '8', 7),
  ],
};

const TOPO_GRAPH: Graph = {
  w: 440, h: 195,
  nodes: [n('5', 60, 40), n('4', 60, 150), n('2', 170, 40), n('3', 280, 40), n('1', 390, 40), n('0', 225, 150)],
  edges: [d('5', '2'), d('5', '0'), d('4', '0'), d('4', '1'), d('2', '3'), d('3', '1')],
};

// ──────────────────────────────────────────────────────────────────────────────
// Step generators (real algorithms, so the animations are always accurate)
// ──────────────────────────────────────────────────────────────────────────────
const nodeStates = (g: Graph, done: Set<string>, queued: string[], current?: string) => {
  const out: Record<string, NState> = {};
  g.nodes.forEach((x) => {
    if (done.has(x.id)) out[x.id] = 'done';
    else if (queued.includes(x.id)) out[x.id] = 'queued';
  });
  if (current) out[current] = 'current';
  return out;
};

const bfsSteps = (g: Graph, start: string): Step[] => {
  const nb = neighbours(g);
  const visited = new Set([start]);
  const queue = [start];
  const done = new Set<string>();
  const order: string[] = [];
  const tree: Record<string, EState> = {};
  const steps: Step[] = [];
  const snap = (text: string, current?: string, active: string[] = []): Step => {
    const edges: Record<string, EState> = { ...tree };
    active.forEach((k) => { if (!edges[k]) edges[k] = 'active'; });
    return {
      text,
      nodes: nodeStates(g, done, queue, current),
      edges,
      lists: [
        { label: 'Queue (front → back)', items: queue.map((q): Chip => ({ t: q, c: 'blue' })) },
        { label: 'Visit order', items: order.map((q): Chip => ({ t: q, c: 'green' })) },
      ],
    };
  };
  steps.push(snap(`Start at ${start}. Mark it as visited and put it in the queue. A queue is first in, first out, like a line at a shop.`));
  while (queue.length) {
    const cur = queue.shift()!;
    order.push(cur);
    steps.push(snap(`Take ${cur} from the front of the queue and visit it.`, cur, nb[cur].map((v) => edgeKey(g, cur, v))));
    const fresh = nb[cur].filter((v) => !visited.has(v));
    const seen = nb[cur].filter((v) => visited.has(v));
    fresh.forEach((v) => { visited.add(v); queue.push(v); tree[edgeKey(g, cur, v)] = 'tree'; });
    done.add(cur);
    const text = fresh.length
      ? `${joinWords(fresh)} ${fresh.length > 1 ? 'are' : 'is'} new, so mark ${fresh.length > 1 ? 'them' : 'it'} as visited and add ${fresh.length > 1 ? 'them' : 'it'} to the back of the queue.${seen.length ? ` ${joinWords(seen)} ${seen.length > 1 ? 'were' : 'was'} already seen, so skip ${seen.length > 1 ? 'them' : 'it'}.` : ''}`
      : `Every neighbour of ${cur} has already been seen, so there is nothing to add.`;
    steps.push(snap(text, undefined));
  }
  steps.push(snap(`The queue is empty, so we are finished. BFS visited the vertices level by level: ${order.join(' → ')}.`));
  return steps;
};

const dfsSteps = (g: Graph, start: string): Step[] => {
  const nb = neighbours(g);
  const visited = new Set<string>();
  const stack: string[] = [];
  const done = new Set<string>();
  const order: string[] = [];
  const tree: Record<string, EState> = {};
  const steps: Step[] = [];
  const snap = (text: string, flash?: string): Step => {
    const edges: Record<string, EState> = { ...tree };
    if (flash) edges[flash] = 'reject';
    return {
      text,
      nodes: nodeStates(g, done, stack.slice(0, -1), stack[stack.length - 1]),
      edges,
      lists: [
        { label: 'Stack (bottom → top)', items: stack.map((q, i): Chip => ({ t: q, c: i === stack.length - 1 ? 'amber' : 'blue' })) },
        { label: 'Visit order', items: order.map((q): Chip => ({ t: q, c: 'green' })) },
      ],
    };
  };
  const visit = (cur: string, from?: string) => {
    visited.add(cur);
    stack.push(cur);
    order.push(cur);
    if (from) tree[edgeKey(g, from, cur)] = 'tree';
    steps.push(snap(from ? `Go deeper: step from ${from} to ${cur}. Put ${cur} on top of the stack.` : `Start at ${cur}. Put it on the stack. A stack is last in, first out, like a pile of plates.`));
    nb[cur].forEach((v) => {
      if (v === from) return;
      if (visited.has(v)) {
        steps.push(snap(`${v} has already been visited, so skip it. This is how we avoid walking in circles.`, edgeKey(g, cur, v)));
      } else {
        visit(v, cur);
        steps.push(snap(`Back at ${cur}. Check its next neighbour.`));
      }
    });
    stack.pop();
    done.add(cur);
    const back = stack[stack.length - 1];
    steps.push(snap(back ? `${cur} has no new neighbours left. Take it off the stack and backtrack to ${back}.` : `${cur} is finished and the stack is empty.`));
  };
  visit(start);
  // The last "Back at" step is redundant right before finishing; keep the walkthrough tight
  const last = steps[steps.length - 1];
  last.text = `The stack is empty, so we are finished. DFS went as deep as it could each time: ${order.join(' → ')}.`;
  return steps;
};

const dijkstraSteps = (g: Graph, src: string): Step[] => {
  const dist: Record<string, number> = {};
  const prev: Record<string, string> = {};
  g.nodes.forEach((x) => { dist[x.id] = Infinity; });
  dist[src] = 0;
  const settled = new Set<string>();
  const order: string[] = [];
  const steps: Step[] = [];
  const fmt = (v: number) => (v === Infinity ? '∞' : String(v));
  const snap = (text: string, current?: string, active: string[] = []): Step => {
    const edges: Record<string, EState> = {};
    Object.keys(prev).forEach((v) => { edges[edgeKey(g, prev[v], v)] = 'tree'; });
    active.forEach((k) => { if (edges[k] !== 'tree') edges[k] = 'active'; });
    const frontier = g.nodes.filter((x) => !settled.has(x.id) && dist[x.id] < Infinity).map((x) => x.id);
    const badges: Record<string, string> = {};
    g.nodes.forEach((x) => { badges[x.id] = fmt(dist[x.id]); });
    return {
      text,
      nodes: nodeStates(g, settled, frontier, current),
      edges,
      badges,
      lists: [{ label: 'Final distances', items: order.map((v): Chip => ({ t: `${v}: ${dist[v]}`, c: 'green' })) }],
    };
  };
  steps.push(snap(`Goal: find the shortest distance from ${src} to every other vertex. We start with ${src} = 0. Everything else is unknown (∞). The number above each circle is its best distance so far.`));
  for (;;) {
    let best: string | undefined;
    g.nodes.forEach((x) => { if (!settled.has(x.id) && dist[x.id] < Infinity && (best === undefined || dist[x.id] < dist[best])) best = x.id; });
    if (best === undefined) break;
    const cur = best;
    settled.add(cur);
    order.push(cur);
    steps.push(snap(`Pick the unfinished vertex with the smallest distance: ${cur} (${dist[cur]}). Nothing can beat it now, so its distance is final.`, cur));
    const changes: string[] = [];
    const active: string[] = [];
    g.edges.forEach((e) => {
      const v = e.a === cur ? e.b : !e.directed && e.b === cur ? e.a : undefined;
      if (v === undefined || settled.has(v)) return;
      const nd = dist[cur] + (e.w ?? 1);
      if (nd < dist[v]) {
        changes.push(`${v}: ${fmt(dist[v])} → ${nd}`);
        dist[v] = nd;
        prev[v] = cur;
        active.push(edgeKey(g, cur, v));
      }
    });
    steps.push(snap(
      changes.length
        ? `Look at the roads out of ${cur}. A shorter way was found for ${changes.join(', ')}.`
        : `Look at the roads out of ${cur}. No shorter routes were found.`,
      cur, active,
    ));
  }
  const final = snap(`Done! The green roads are the shortest routes from ${src}. For example, the shortest way to 4 costs ${dist['4']}.`);
  final.nodes = Object.fromEntries(g.nodes.map((x) => [x.id, x.id === src ? 'source' : 'done'])) as Record<string, NState>;
  steps.push(final);
  return steps;
};

const PALETTE = ['#6366f1', '#ec4899', '#14b8a6', '#f97316', '#0ea5e9', '#a855f7', '#84cc16', '#eab308', '#f43f5e'];

const kruskalSteps = (g: Graph): Step[] => {
  const sorted = g.edges.map((e, i) => ({ e, i })).sort((p, q) => (p.e.w! - q.e.w!) || (p.i - q.i)).map((p) => p.e);
  const parent: Record<string, string> = {};
  g.nodes.forEach((x) => { parent[x.id] = x.id; });
  const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const status: Record<string, 'ok' | 'no'> = {};
  const steps: Step[] = [];
  let total = 0;
  let count = 0;
  const snap = (text: string, current?: GEdge): Step => {
    const edges: Record<string, EState> = {};
    Object.keys(status).forEach((k) => { edges[k] = status[k] === 'ok' ? 'tree' : 'gone'; });
    if (current) edges[`${current.a}-${current.b}`] = 'active';
    const roots = Array.from(new Set(g.nodes.map((x) => find(x.id))));
    const fills: Record<string, string> = {};
    g.nodes.forEach((x) => {
      const members = g.nodes.filter((y) => find(y.id) === find(x.id)).length;
      fills[x.id] = members > 1 ? PALETTE[roots.indexOf(find(x.id)) % PALETTE.length] : '#94a3b8';
    });
    return {
      text,
      edges,
      fills,
      lists: [
        {
          label: 'Edges, cheapest first',
          items: sorted.map((e): Chip => {
            const k = `${e.a}-${e.b}`;
            const c = current && k === `${current.a}-${current.b}` ? 'amber' : status[k] === 'ok' ? 'green' : status[k] === 'no' ? 'red' : 'grey';
            return { t: `${e.a}-${e.b} (${e.w})`, c };
          }),
        },
        { label: 'Total weight', items: [{ t: String(total), c: 'blue' }] },
      ],
    };
  };
  steps.push(snap('Step 1: sort every edge from cheapest to most expensive. Then look at them one at a time, cheapest first. Vertices get the same colour when they are already connected.'));
  for (const e of sorted) {
    if (count === g.nodes.length - 1) break;
    const ra = find(e.a);
    const rb = find(e.b);
    if (ra !== rb) {
      steps.push(snap(`Look at ${e.a}-${e.b} (weight ${e.w}). ${e.a} and ${e.b} are not connected yet, so adding it is safe.`, e));
      parent[ra] = rb;
      status[`${e.a}-${e.b}`] = 'ok';
      total += e.w!;
      count++;
      steps.push(snap(`Accept ${e.a}-${e.b}. Total weight so far: ${total}.`));
    } else {
      steps.push(snap(`Look at ${e.a}-${e.b} (weight ${e.w}). ${e.a} and ${e.b} are already connected by other edges, so adding it would make a loop.`, e));
      status[`${e.a}-${e.b}`] = 'no';
      steps.push(snap(`Reject ${e.a}-${e.b}. Skip it.`));
    }
  }
  steps.push(snap(`We have ${count} edges, which is one less than the ${g.nodes.length} vertices, so everything is connected. Stop! The minimum total weight is ${total}.`));
  return steps;
};

const primSteps = (g: Graph, start: string): Step[] => {
  const inTree = new Set([start]);
  const chosen: Record<string, EState> = {};
  const steps: Step[] = [];
  let total = 0;
  const snap = (text: string, frontier: string[] = [], pick?: string): Step => {
    const edges: Record<string, EState> = { ...chosen };
    frontier.forEach((k) => { edges[k] = 'active'; });
    if (pick) edges[pick] = 'tree';
    return {
      text,
      edges,
      nodes: Object.fromEntries(g.nodes.filter((x) => inTree.has(x.id)).map((x) => [x.id, x.id === start ? 'source' : 'done'])) as Record<string, NState>,
      lists: [
        { label: 'Vertices in the tree', items: Array.from(inTree).map((x): Chip => ({ t: x, c: 'green' })) },
        { label: 'Total weight', items: [{ t: String(total), c: 'blue' }] },
      ],
    };
  };
  steps.push(snap(`Start with just vertex ${start}. The idea: keep growing one tree by always adding the cheapest edge that reaches a new vertex.`));
  while (inTree.size < g.nodes.length) {
    const frontier = g.edges.filter((e) => inTree.has(e.a) !== inTree.has(e.b));
    let best = frontier[0];
    frontier.forEach((e) => { if (e.w! < best.w!) best = e; });
    const keys = frontier.map((e) => `${e.a}-${e.b}`);
    const newV = inTree.has(best.a) ? best.b : best.a;
    steps.push(snap(`The edges that leave the tree are lit up. The cheapest is ${best.a}-${best.b} (${best.w}).`, keys));
    inTree.add(newV);
    chosen[`${best.a}-${best.b}`] = 'tree';
    total += best.w!;
    steps.push(snap(`Add vertex ${newV} using that edge. Total weight so far: ${total}.`));
  }
  steps.push(snap(`Every vertex is in the tree. The minimum total weight is ${total}. Kruskal found the same answer, just in a different order.`));
  return steps;
};

const topoSteps = (g: Graph): Step[] => {
  const nb = neighbours(g);
  const indeg: Record<string, number> = {};
  g.nodes.forEach((x) => { indeg[x.id] = 0; });
  g.edges.forEach((e) => { indeg[e.b]++; });
  const queue = g.nodes.filter((x) => indeg[x.id] === 0).map((x) => x.id);
  const output: string[] = [];
  const gone: Record<string, EState> = {};
  const steps: Step[] = [];
  const snap = (text: string, current?: string, active: string[] = []): Step => {
    const edges: Record<string, EState> = { ...gone };
    active.forEach((k) => { edges[k] = 'active'; });
    const nodes = nodeStates(g, new Set(output.filter((o) => o !== current)), queue, current);
    const badges: Record<string, string> = {};
    g.nodes.forEach((x) => { if (!output.includes(x.id)) badges[x.id] = `in: ${indeg[x.id]}`; });
    return {
      text,
      nodes,
      edges,
      badges,
      lists: [
        { label: 'Ready (queue)', items: queue.map((q): Chip => ({ t: q, c: 'blue' })) },
        { label: 'Order so far', items: output.map((q): Chip => ({ t: q, c: 'green' })) },
      ],
    };
  };
  steps.push(snap(`Each arrow means "this must come first". The number "in" counts how many arrows point INTO a vertex, meaning how many things it is still waiting for. Vertices with in: 0 are ready to go.`));
  while (queue.length) {
    const cur = queue.shift()!;
    output.push(cur);
    const outs = nb[cur];
    const keys = outs.map((v) => edgeKey(g, cur, v));
    const freed: string[] = [];
    outs.forEach((v) => { indeg[v]--; if (indeg[v] === 0) { queue.push(v); freed.push(v); } });
    steps.push(snap(
      outs.length
        ? `Take ${cur} from the queue and put it in the order. Remove its arrows, so ${joinWords(outs)} ${outs.length > 1 ? 'each wait' : 'waits'} for one less thing.${freed.length ? ` ${joinWords(freed)} ${freed.length > 1 ? 'now have' : 'now has'} in: 0, so ${freed.length > 1 ? 'they join' : 'it joins'} the queue.` : ''}`
        : `Take ${cur} from the queue and put it in the order. It has no arrows going out, so nothing else changes.`,
      cur, keys,
    ));
    keys.forEach((k) => { gone[k] = 'gone'; });
  }
  steps.push(snap(`Everything is in the order: ${output.join(' → ')}. Every arrow points forward, so each task comes after the ones it depends on. Other valid orders exist too.`));
  return steps;
};

// ──────────────────────────────────────────────────────────────────────────────
// Demos
// ──────────────────────────────────────────────────────────────────────────────
export const IntroGraphDemo: React.FC = () => {
  const { ref, visible } = useOnScreen();
  const graph: Graph = {
    w: 440, h: 190,
    nodes: [n('A', 70, 60, 'Home'), n('B', 200, 30, 'School'), n('C', 330, 70, 'Shop'), n('D', 140, 140, 'Park'), n('E', 300, 150, 'Gym')],
    edges: [u('A', 'B'), u('B', 'C'), u('A', 'D'), u('D', 'E'), u('C', 'E'), u('B', 'D')],
  };
  const steps: Step[] = [
    { text: 'Here is a tiny town. Each place is one dot.' },
    { text: 'Each dot is called a vertex (also called a node). It stands for one thing: a place, a person, a computer.', nodes: { A: 'current', B: 'current', C: 'current', D: 'current', E: 'current' } },
    { text: 'Each line is called an edge. It shows that two things are connected, like a road between two places.', edges: Object.fromEntries(graph.edges.map((e) => [`${e.a}-${e.b}`, 'tree'])) as Record<string, EState> },
    { text: 'Vertices plus edges make a graph. Now we can ask useful questions, like "what is the quickest way from Home to the Gym?"', nodes: { A: 'source', E: 'bad' }, edges: { 'A-D': 'active', 'D-E': 'active' } },
  ];
  return (
    <div ref={ref}>
      <GraphStyles />
      <DemoCard title="A graph is dots and lines" accent="#ea580c">
        <GraphPlayer graph={graph} steps={steps} accent="#ea580c" base="#ea580c" playing={visible} stepMs={3200} maxW={420} />
      </DemoCard>
    </div>
  );
};

type TypeDef = { title: string; accent: string; definition: string; simple: string; graph: Graph; steps: Step[] };

const mini = (nodes: ReturnType<typeof n>[], edges: GEdge[]): Graph => ({ w: 220, h: 135, nodes, edges });

const TYPES: TypeDef[] = [
  {
    title: 'Undirected Graph', accent: '#6366f1',
    definition: 'Edges have no direction.',
    simple: 'Like a two-way street. If you can drive from A to B, you can drive back from B to A.',
    graph: mini([n('A', 40, 90), n('B', 110, 28), n('C', 180, 90)], [u('A', 'B'), u('B', 'C'), u('A', 'C')]),
    steps: [
      { text: 'A to B is allowed.', nodes: { A: 'source', B: 'current' }, edges: { 'A-B': 'active' } },
      { text: 'And B to A is allowed too. The road works both ways.', nodes: { B: 'source', A: 'current' }, edges: { 'A-B': 'active' } },
    ],
  },
  {
    title: 'Directed Graph', accent: '#0ea5e9',
    definition: 'Edges have a direction (A→B is not the same as B→A).',
    simple: 'Like a one-way street. The arrow shows the only way you may travel.',
    graph: mini([n('A', 40, 90), n('B', 110, 28), n('C', 180, 90)], [d('A', 'B'), d('B', 'C'), d('A', 'C')]),
    steps: [
      { text: 'A to B is allowed because the arrow points that way.', nodes: { A: 'source', B: 'current' }, edges: { 'A-B': 'active' } },
      { text: 'B to A is NOT allowed. The arrow only points one way.', nodes: { B: 'source', A: 'bad' }, edges: { 'A-B': 'reject' } },
    ],
  },
  {
    title: 'Weighted Graph', accent: '#f59e0b',
    definition: 'Edges have a weight (a cost, such as distance or time).',
    simple: 'Each road has a number on it, like kilometres. The shortest path is not always the one with the fewest roads.',
    graph: mini([n('A', 40, 95), n('B', 110, 30), n('C', 180, 95)], [u('A', 'B', 2), u('B', 'C', 3), u('A', 'C', 10)]),
    steps: [
      { text: 'The direct road from A to C costs 10.', nodes: { A: 'source', C: 'bad' }, edges: { 'A-C': 'reject' } },
      { text: 'Going through B costs 2 + 3 = 5. That is cheaper, even though it uses two roads.', nodes: { A: 'source', B: 'queued', C: 'done' }, edges: { 'A-B': 'tree', 'B-C': 'tree' } },
    ],
  },
  {
    title: 'Unweighted Graph', accent: '#14b8a6',
    definition: 'Edges have no weights.',
    simple: 'Every road counts the same. The only thing that matters is how many steps you take.',
    graph: mini([n('A', 30, 70), n('B', 100, 25), n('C', 170, 25), n('D', 190, 100)], [u('A', 'B'), u('B', 'C'), u('C', 'D'), u('A', 'D')]),
    steps: [
      { text: 'A to C through B takes 2 steps.', nodes: { A: 'source', B: 'queued', C: 'done' }, edges: { 'A-B': 'tree', 'B-C': 'tree' } },
      { text: 'A to D is a single step. With no weights, fewer steps simply means shorter.', nodes: { A: 'source', D: 'done' }, edges: { 'A-D': 'tree' } },
    ],
  },
  {
    title: 'Cyclic Graph', accent: '#ef4444',
    definition: 'Contains at least one cycle (a path that leads back to where it started).',
    simple: 'Like a roundabout. Keep driving and you end up back at the start.',
    graph: mini([n('A', 40, 90), n('B', 110, 28), n('C', 180, 90)], [d('A', 'B'), d('B', 'C'), d('C', 'A')]),
    steps: [
      { text: 'Start at A and follow the arrow to B.', nodes: { A: 'source', B: 'current' }, edges: { 'A-B': 'tree' } },
      { text: 'Then follow the arrow to C.', nodes: { A: 'source', B: 'queued', C: 'current' }, edges: { 'A-B': 'tree', 'B-C': 'tree' } },
      { text: 'C leads straight back to A. We are in a loop. That is a cycle!', nodes: { A: 'bad', B: 'queued', C: 'queued' }, edges: { 'A-B': 'tree', 'B-C': 'tree', 'C-A': 'reject' } },
    ],
  },
  {
    title: 'Acyclic Graph', accent: '#8b5cf6',
    definition: 'Contains no cycles.',
    simple: 'You can never get back to where you started. Think of a family tree or a to-do list.',
    graph: mini([n('A', 110, 22), n('B', 45, 70), n('C', 175, 70), n('D', 110, 118)], [d('A', 'B'), d('A', 'C'), d('B', 'D'), d('C', 'D')]),
    steps: [
      { text: 'From A you can go down to B or C.', nodes: { A: 'source', B: 'queued', C: 'queued' }, edges: { 'A-B': 'tree', 'A-C': 'tree' } },
      { text: 'Both paths end at D.', nodes: { A: 'source', B: 'queued', C: 'queued', D: 'current' }, edges: { 'A-B': 'tree', 'A-C': 'tree', 'B-D': 'tree', 'C-D': 'tree' } },
      { text: 'There is no arrow back up, so there is no way to return to A. No cycle.', nodes: { A: 'done', B: 'done', C: 'done', D: 'done' } },
    ],
  },
  {
    title: 'Connected Graph', accent: '#10b981',
    definition: 'Every vertex can be reached from every other vertex.',
    simple: 'One island with bridges everywhere. You can walk from any place to any other place.',
    graph: mini([n('A', 30, 70), n('B', 85, 30), n('C', 140, 95), n('D', 195, 50)], [u('A', 'B'), u('B', 'C'), u('C', 'D')]),
    steps: [
      { text: 'Start at A.', nodes: { A: 'source' } },
      { text: 'From A we reach B, then C.', nodes: { A: 'source', B: 'done', C: 'done' }, edges: { 'A-B': 'tree', 'B-C': 'tree' } },
      { text: 'And then D. Every vertex was reachable, so the graph is connected.', nodes: { A: 'source', B: 'done', C: 'done', D: 'done' }, edges: { 'A-B': 'tree', 'B-C': 'tree', 'C-D': 'tree' } },
    ],
  },
  {
    title: 'Disconnected Graph', accent: '#64748b',
    definition: 'Some vertices cannot be reached from others.',
    simple: 'Two separate islands with no bridge between them. You cannot walk from one island to the other.',
    graph: mini([n('A', 35, 70), n('B', 85, 35), n('C', 145, 95), n('D', 195, 55)], [u('A', 'B'), u('C', 'D')]),
    steps: [
      { text: 'Start at A. We can reach B.', nodes: { A: 'source', B: 'done' }, edges: { 'A-B': 'tree' } },
      { text: 'But C and D cannot be reached at all. They sit on a separate island, so the graph is disconnected.', nodes: { A: 'source', B: 'done', C: 'bad', D: 'bad' }, edges: { 'A-B': 'tree' } },
    ],
  },
];

export const GraphTypesGallery: React.FC = () => {
  const { ref, visible } = useOnScreen();
  return (
    <div ref={ref}>
      <GraphStyles />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {TYPES.map((t) => (
          <div key={t.title} className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] p-4">
            <h4 className="text-sm font-bold" style={{ color: t.accent }}>{t.title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.definition}</p>
            <p className="text-sm text-slate-800 dark:text-slate-200 mt-2 mb-2"><strong>In simple words:</strong> {t.simple}</p>
            <GraphPlayer graph={t.graph} steps={t.steps} accent={t.accent} base={t.accent} playing={visible} compact maxW={230} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TraversalDemo: React.FC = () => {
  const { ref, visible } = useOnScreen();
  const [tab, setTab] = useState(0);
  const bfs = useMemo(() => bfsSteps(SEARCH_GRAPH, 'A'), []);
  const dfs = useMemo(() => dfsSteps(SEARCH_GRAPH, 'A'), []);
  return (
    <div ref={ref}>
      <GraphStyles />
      <DemoCard title="Watch both searches start at A" accent={tab === 0 ? '#3b82f6' : '#a855f7'} tabs={{ names: ['BFS (queue)', 'DFS (stack)'], value: tab, onChange: setTab }}>
        <GraphPlayer key={tab} graph={SEARCH_GRAPH} steps={tab === 0 ? bfs : dfs} accent={tab === 0 ? '#3b82f6' : '#a855f7'} playing={visible} stepMs={3200} maxW={440} />
      </DemoCard>
    </div>
  );
};

export const RepresentationDemo: React.FC = () => {
  const { ref, visible } = useOnScreen();
  const graph: Graph = {
    w: 300, h: 190,
    nodes: [n('A', 150, 28), n('B', 60, 90), n('C', 240, 90), n('D', 100, 155), n('E', 220, 160)],
    edges: [u('A', 'B'), u('A', 'C'), u('B', 'D'), u('C', 'D'), u('D', 'E')],
  };
  const steps = useMemo(() => {
    const ids = graph.nodes.map((x) => x.id);
    const cells = ids.map(() => ids.map(() => 0));
    const lists: Record<string, string[]> = Object.fromEntries(ids.map((i) => [i, []]));
    const out: Step[] = [];
    const rows = (hot: string[] = [], hotOf: string[] = []) =>
      ids.map((i) => ({ label: `${i} →`, items: lists[i].map((v): Chip => ({ t: v, c: hotOf.includes(i) && hot.includes(v) ? 'amber' : 'blue' })) }));
    const snap = (text: string, hl: [number, number][] = [], e?: GEdge): Step => ({
      text,
      edges: Object.fromEntries(graph.edges.filter((x) => lists[x.a].includes(x.b)).map((x) => [`${x.a}-${x.b}`, x === e ? 'active' : 'tree'])) as Record<string, EState>,
      matrix: { labels: ids, cells: cells.map((r) => [...r]), hl },
      lists: rows(e ? [e.a, e.b] : [], e ? [e.a, e.b] : []),
    });
    out.push(snap('This graph has 5 vertices and 5 edges. We will store it two ways. Left to right: the matrix (a grid) and the adjacency list (a list of neighbours for each vertex). Both start empty.'));
    graph.edges.forEach((e) => {
      const i = ids.indexOf(e.a);
      const j = ids.indexOf(e.b);
      cells[i][j] = 1;
      cells[j][i] = 1;
      lists[e.a].push(e.b);
      lists[e.b].push(e.a);
      out.push(snap(`Edge ${e.a}-${e.b}. Matrix: write 1 in row ${e.a} column ${e.b}, and also row ${e.b} column ${e.a} (the road works both ways). List: add ${e.b} to ${e.a}'s list and ${e.a} to ${e.b}'s list.`, [[i, j], [j, i]], e));
    });
    out.push(snap('Compare the two. The matrix always needs V × V = 25 boxes, even though most of them are 0. The list only stores the 10 neighbours that really exist, so it uses less memory for graphs with few edges. The matrix can answer "is A connected to B?" instantly by checking one box.'));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={ref}>
      <GraphStyles />
      <DemoCard title="Building a matrix and a list, edge by edge" accent="#6366f1">
        <GraphPlayer graph={graph} steps={steps} accent="#6366f1" playing={visible} stepMs={3400} maxW={320} />
      </DemoCard>
    </div>
  );
};

export const TopoSortDemo: React.FC = () => {
  const { ref, visible } = useOnScreen();
  const steps = useMemo(() => topoSteps(TOPO_GRAPH), []);
  return (
    <div ref={ref}>
      <GraphStyles />
      <DemoCard title="Ordering tasks that depend on each other" accent="#0ea5e9">
        <GraphPlayer graph={TOPO_GRAPH} steps={steps} accent="#0ea5e9" playing={visible} stepMs={3400} maxW={440} />
      </DemoCard>
    </div>
  );
};

export const DijkstraDemo: React.FC = () => {
  const { ref, visible } = useOnScreen();
  const steps = useMemo(() => dijkstraSteps(WEIGHTED_GRAPH, '0'), []);
  return (
    <div ref={ref}>
      <GraphStyles />
      <DemoCard title="Dijkstra: shortest roads from vertex 0" accent="#f97316">
        <GraphPlayer graph={WEIGHTED_GRAPH} steps={steps} accent="#f97316" playing={visible} stepMs={3200} />
      </DemoCard>
    </div>
  );
};

export const MstDemo: React.FC = () => {
  const { ref, visible } = useOnScreen();
  const [tab, setTab] = useState(0);
  const kruskal = useMemo(() => kruskalSteps(WEIGHTED_GRAPH), []);
  const prim = useMemo(() => primSteps(WEIGHTED_GRAPH, '0'), []);
  return (
    <div ref={ref}>
      <GraphStyles />
      <DemoCard title="Connect every vertex as cheaply as possible" accent={tab === 0 ? '#10b981' : '#ec4899'} tabs={{ names: ['Kruskal', 'Prim'], value: tab, onChange: setTab }}>
        <GraphPlayer key={tab} graph={WEIGHTED_GRAPH} steps={tab === 0 ? kruskal : prim} accent={tab === 0 ? '#10b981' : '#ec4899'} playing={visible} stepMs={3000} />
      </DemoCard>
    </div>
  );
};

export const WarshallDemo: React.FC = () => {
  const { ref, visible } = useOnScreen();
  const graph: Graph = {
    w: 420, h: 150,
    nodes: [n('0', 60, 105), n('1', 160, 40), n('2', 260, 105), n('3', 360, 40)],
    edges: [d('0', '1'), d('1', '2'), d('2', '3')],
  };
  const steps = useMemo(() => {
    const ids = graph.nodes.map((x) => x.id);
    const V = ids.length;
    const R: number[][] = ids.map((_, i) => ids.map((__, j) => (i === j || findEdge(graph, ids[i], ids[j]) ? 1 : 0)));
    const extra: { a: string; b: string }[] = [];
    const out: Step[] = [];
    const base = (text: string, m: Partial<Step['matrix']> = {}, k?: number): Step => ({
      text,
      nodes: k !== undefined ? { [ids[k]]: 'current' } : undefined,
      extraEdges: [...extra],
      matrix: { labels: ids, cells: R.map((r) => [...r]), rowHl: k, colHl: k, ...m },
    });
    out.push(base('Goal: for every pair (i, j), find out whether you can get from i to j by following arrows, even through other vertices. 1 means "yes, reachable". Start with the direct arrows only. Every vertex can reach itself.'));
    for (let k = 0; k < V; k++) {
      const fresh: [number, number][] = [];
      const notes: string[] = [];
      for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
          if (!R[i][j] && R[i][k] && R[k][j]) {
            R[i][j] = 1;
            fresh.push([i, j]);
            extra.push({ a: ids[i], b: ids[j] });
            notes.push(`${ids[i]} → ${ids[j]} (${ids[i]} reaches ${ids[k]}, and ${ids[k]} reaches ${ids[j]})`);
          }
        }
      }
      out.push(base(
        notes.length
          ? `Try ${ids[k]} as a stepping stone: can anyone get to someone new by going through ${ids[k]}? Yes! New: ${notes.join('; ')}. The dashed green arrows show the new reachability.`
          : `Try ${ids[k]} as a stepping stone. Nobody gets to anywhere new by going through ${ids[k]}, so nothing changes.`,
        { fresh },
        k,
      ));
    }
    const reach = ids.filter((_, j) => R[0][j]).join(', ');
    out.push(base(`Done! Row 0 shows everything vertex 0 can reach: ${reach}. This table is the transitive closure.`));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={ref}>
      <GraphStyles />
      <DemoCard title="Warshall: who can reach whom?" accent="#8b5cf6">
        <GraphPlayer graph={graph} steps={steps} accent="#8b5cf6" playing={visible} stepMs={3600} maxW={420} />
      </DemoCard>
    </div>
  );
};
