(function(){
  // Fullscreen WebGL plasma shader
  const canvas = document.createElement('canvas');
  canvas.id = 'plasmaCanvas';
  canvas.style.position = 'fixed';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  // overlay: semi-transparent dark blur above the plasma, below page content
  const overlay = document.createElement('div');
  overlay.id = 'plasmaOverlay';
  overlay.style.position = 'fixed';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.zIndex = '2';
  overlay.style.pointerEvents = 'none';
  overlay.style.background = 'rgba(0,0,0,0.88)';
    overlay.style.backdropFilter = 'blur(12px)';
    overlay.style.webkitBackdropFilter = 'blur(12px)';
  document.body.appendChild(overlay);

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.warn('WebGL not supported for plasma effect');
    return;
  }

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, `
    attribute vec2 aPos;
    void main(){
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `);

  const fs = compile(gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;

    // site palette: reduced white, stronger gold and grey
    vec3 palette(float v, float t) {
      vec3 white = vec3(1.0, 1.0, 1.0);
      vec3 gold  = vec3(1.0, 0.843, 0.0);
      vec3 grey  = vec3(0.55, 0.55, 0.55);

      float a = 0.4 + 0.35 * sin(2.0 * 3.14159 * (t + v * 0.6));
      float b = 0.45 + 0.35 * sin(2.0 * 3.14159 * (t * 0.8 + v * 0.9) + 1.0);

      // bias towards grey and gold; keep white minimal
      vec3 col = white * 0.12 + gold * (0.5 * b + 0.15 * a) + grey * (0.88 - 0.25 * b);
      return clamp(col, 0.0, 1.0);
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= u_resolution.x / u_resolution.y;

      float t = u_time * 0.6;

      float v1 = sin((p.x * 3.0 + t) + sin((p.y * 3.0 + t * 1.1)));
      float v2 = sin((p.y * 4.0 - t * 0.9) + cos((p.x * 4.0 + t * 0.6)));
      float v3 = sin(length(p) * 5.0 - t * 1.2);

      float v = (v1 + v2 + v3) * 0.333;
      float intensity = smoothstep(-0.8, 0.8, v);

      vec3 col = palette(v * 0.5 + 0.5, t);
      col *= 0.45 + 0.9 * intensity; // boost contrast for palette

      // subtle vignette
      float dist = length(uv - 0.5);
      col *= 1.0 - smoothstep(0.65, 1.0, dist);

      gl_FragColor = vec4(col, 1.0);
    }
  `);

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog));
  }

  const aPos = gl.getAttribLocation(prog, 'aPos');
  const uRes = gl.getUniformLocation(prog, 'u_resolution');
  const uTime = gl.getUniformLocation(prog, 'u_time');

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  // full-screen two triangles
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1, -1, 1,
    -1, 1,   1, -1,  1, 1
  ]), gl.STATIC_DRAW);

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  let start = performance.now();
  function render(now) {
    resize();
    const t = (performance.now() - start) / 1000;

    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // expose a way to toggle visibility if needed
  window.__plasmaCanvas = canvas;
})();
