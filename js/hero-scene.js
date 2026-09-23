/**
 * Mitsab Resources Global — hero wireframe scene
 * Renders only on pages that contain a <canvas id="hero-canvas">.
 * A deforming terrain grid (site-survey read) plus a live constellation
 * of amber nodes that connect when they drift close to one another.
 */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 22, 46);
  camera.lookAt(0, 0, 0);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function isLight() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'light') return true;
    if (t === 'dark') return false;
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  }
  var lineColor = function () { return isLight() ? 0x12161B : 0xEDEAE2; };
  var accentColor = 0xFF7A1A;

  // ---- terrain grid ----
  var size = 140, seg = 42;
  var geo = new THREE.PlaneGeometry(size, size, seg, seg);
  geo.rotateX(-Math.PI / 2.4);
  var posAttr = geo.attributes.position;

  function heightAt(x, z, t) {
    return Math.sin(x * 0.09 + t) * 2.6 + Math.cos(z * 0.12 - t * 0.7) * 2.1 + Math.sin((x + z) * 0.05 + t * 0.4) * 1.4;
  }

  var mat = new THREE.MeshBasicMaterial({ color: lineColor(), wireframe: true, transparent: true, opacity: 0.42 });
  var mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = -6;
  scene.add(mesh);

  // ---- constellation nodes ----
  var nodeCount = 46;
  var nodes = [];
  for (var i = 0; i < nodeCount; i++) {
    nodes.push({
      x: (Math.random() - 0.5) * size,
      z: (Math.random() - 0.5) * size,
      vx: (Math.random() - 0.5) * 0.02,
      vz: (Math.random() - 0.5) * 0.02
    });
  }
  var nodeGeo = new THREE.BufferGeometry();
  var nodePos = new Float32Array(nodeCount * 3);
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  var nodeMat = new THREE.PointsMaterial({ color: accentColor, size: 1.2, transparent: true, opacity: 0.9 });
  var pointCloud = new THREE.Points(nodeGeo, nodeMat);
  pointCloud.position.y = -5.4;
  scene.add(pointCloud);

  // line connections between nearby nodes — rebuilt each frame from a
  // pre-allocated buffer sized for the worst case, then draw-range trimmed.
  var maxLines = nodeCount * 6;
  var lineGeo = new THREE.BufferGeometry();
  var linePos = new Float32Array(maxLines * 2 * 3);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  var lineMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0.16 });
  var lineSegments = new THREE.LineSegments(lineGeo, lineMat);
  lineSegments.position.y = -5.4;
  scene.add(lineSegments);

  var CONNECT_DIST = 16;

  var mouseX = 0, mouseY = 0, targetRotX = 0, targetRotY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  }, { passive: true });

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  var clock = new THREE.Clock();
  var frame = 0;

  function animate() {
    var t = clock.getElapsedTime();

    if (!prefersReduced) {
      var positions = posAttr.array;
      for (var p = 0; p < positions.length; p += 3) {
        var x = positions[p], z = positions[p + 2];
        positions[p + 1] = heightAt(x, z, t * 0.35);
      }
      posAttr.needsUpdate = true;

      // drift nodes, wrap at bounds
      var half = size / 2;
      for (var n = 0; n < nodeCount; n++) {
        var nd = nodes[n];
        nd.x += nd.vx; nd.z += nd.vz;
        if (nd.x > half) nd.x = -half; if (nd.x < -half) nd.x = half;
        if (nd.z > half) nd.z = -half; if (nd.z < -half) nd.z = half;
        nodePos[n * 3] = nd.x;
        nodePos[n * 3 + 1] = heightAt(nd.x, nd.z, t * 0.35) + 1.2;
        nodePos[n * 3 + 2] = nd.z;
      }
      nodeGeo.attributes.position.needsUpdate = true;

      // rebuild constellation lines between nearby nodes
      var lineCount = 0;
      for (var a = 0; a < nodeCount && lineCount < maxLines; a++) {
        for (var b = a + 1; b < nodeCount && lineCount < maxLines; b++) {
          var dx = nodes[a].x - nodes[b].x, dz = nodes[a].z - nodes[b].z;
          var d2 = dx * dx + dz * dz;
          if (d2 < CONNECT_DIST * CONNECT_DIST) {
            var idx = lineCount * 6;
            linePos[idx] = nodePos[a * 3]; linePos[idx + 1] = nodePos[a * 3 + 1]; linePos[idx + 2] = nodePos[a * 3 + 2];
            linePos[idx + 3] = nodePos[b * 3]; linePos[idx + 4] = nodePos[b * 3 + 1]; linePos[idx + 5] = nodePos[b * 3 + 2];
            lineCount++;
          }
        }
      }
      lineGeo.setDrawRange(0, lineCount * 2);
      lineGeo.attributes.position.needsUpdate = true;

      targetRotX += (mouseY * 0.12 - targetRotX) * 0.03;
      targetRotY += (mouseX * 0.18 - targetRotY) * 0.03;
      scene.rotation.x = targetRotX * 0.3;
      scene.rotation.y = targetRotY * 0.3;
    }

    frame++;
    if (frame % 30 === 0) { mat.color.set(lineColor()); }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
