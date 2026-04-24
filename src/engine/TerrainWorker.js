/**
 * Primordial Ascent - Terrain Worker
 * Self-contained voxel mesher.
 * ZERO EXTERNAL DEPENDENCIES.
 */

function createSimplexNoise(random) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const r = Math.floor(random() * (i + 1));
    const tmp = p[i];
    p[i] = p[r];
    p[r] = tmp;
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  const grad3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
    1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
    0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1
  ]);

  return (xin, yin, zin) => {
    let n0, n1, n2, n3;
    const F3 = 1.0 / 3.0;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const G3 = 1.0 / 6.0;
    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }
    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3;
    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3;
    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3;
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0.0;
    else {
      t0 *= t0;
      const gi = permMod12[ii + perm[jj + perm[kk]]] * 3;
      n0 = t0 * t0 * (grad3[gi] * x0 + grad3[gi + 1] * y0 + grad3[gi + 2] * z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0.0;
    else {
      t1 *= t1;
      const gi = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      n1 = t1 * t1 * (grad3[gi] * x1 + grad3[gi + 1] * y1 + grad3[gi + 2] * z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0.0;
    else {
      t2 *= t2;
      const gi = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      n2 = t2 * t2 * (grad3[gi] * x2 + grad3[gi + 1] * y2 + grad3[gi + 2] * z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0.0;
    else {
      t3 *= t3;
      const gi = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      n3 = t3 * t3 * (grad3[gi] * x3 + grad3[gi + 1] * y3 + grad3[gi + 2] * z3);
    }
    return 32.0 * (n0 + n1 + n2 + n3);
  };
}

self.onmessage = (e) => {
  const { cx, cy, cz, config, time } = e.data;
  
  let seedVal = 0;
  const str = config.seed || "void";
  for (let i = 0; i < str.length; i++) {
    seedVal = (seedVal << 5) - seedVal + str.charCodeAt(i);
    seedVal |= 0;
  }
  
  const random = () => {
    seedVal = (seedVal + 0x6d2b79f5) | 0;
    let t = Math.imul(seedVal ^ (seedVal >>> 15), 1 | seedVal);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) | 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const noise3D = createSimplexNoise(random);
  const size = config.chunkSize;
  const vs = config.voxelSize;
  const scale = config.noiseScale;

  const positions = [];
  const indices = [];
  const normals = [];
  const colors = [];

  const densities = new Float32Array((size + 3) * (size + 3) * (size + 3));
  const idx = (x, y, z) => x + (size + 3) * (y + (size + 3) * z);

  for (let z = -1; z <= size + 1; z++) {
    for (let y = -1; y <= size + 1; y++) {
      for (let x = -1; x <= size + 1; x++) {
        const wx = (cx * size + x) * vs;
        const wy = (cy * size + y) * vs;
        const wz = (cz * size + z) * vs;
        const distFromCenter = Math.sqrt(wx * wx + wz * wz);
        const baseDensity = 24 - distFromCenter;
        const n = noise3D(wx * scale, wy * scale, wz * scale);
        densities[idx(x + 1, y + 1, z + 1)] = baseDensity + n * 18;
      }
    }
  }

  const faces = [
    { dir: [1, 0, 0], corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
    { dir: [-1, 0, 0], corners: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]] },
    { dir: [0, 1, 0], corners: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]] },
    { dir: [0, -1, 0], corners: [[0, 0, 1], [0, 0, 0], [1, 0, 0], [1, 0, 1]] },
    { dir: [0, 0, 1], corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] },
    { dir: [0, 0, -1], corners: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]] },
  ];

  const pulse = Math.sin(time * 2) * 0.2 + 0.8;

  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (densities[idx(x + 1, y + 1, z + 1)] > config.isoLevel) {
          const wx = (cx * size + x) * vs;
          const wy = (cy * size + y) * vs;
          const wz = (cz * size + z) * vs;
          const colorNoise = noise3D(wx * 0.03, wy * 0.03, wz * 0.03);
          const isVein = colorNoise > 0.65;
          const veinHue = (config.seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0) % 360) / 360;
          
          for (let f = 0; f < 6; f++) {
            const face = faces[f];
            if (densities[idx(x + face.dir[0] + 1, y + face.dir[1] + 1, z + face.dir[2] + 1)] <= config.isoLevel) {
              let fr = 0.05, fg = 0.08, fb = 0.1, a = 1.0;
              if (isVein) {
                const h = veinHue;
                const s = 0.8;
                const l = 0.4 + (pulse * 0.2);
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                const hue2rgb = (t) => {
                  if (t < 0) t += 1;
                  if (t > 1) t -= 1;
                  if (t < 1/6) return p + (q - p) * 6 * t;
                  if (t < 1/2) return q;
                  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                  return p;
                };
                fr = hue2rgb(h + 1/3); fg = hue2rgb(h); fb = hue2rgb(h - 1/3);
              }
              if (face.dir[1] === 1) { fr *= 1.4; fg *= 1.4; fb *= 1.4; }
              const startIdx = positions.length / 3;
              for (const corner of face.corners) {
                positions.push((x + corner[0]) * vs, (y + corner[1]) * vs, (z + corner[2]) * vs);
                normals.push(...face.dir);
                colors.push(fr, fg, fb, a);
              }
              indices.push(startIdx, startIdx + 1, startIdx + 2, startIdx, startIdx + 2, startIdx + 3);
            }
          }
        }
      }
    }
  }

  self.postMessage({
    cx, cy, cz,
    positions: new Float32Array(positions),
    indices: new Uint32Array(indices),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
  });
};
