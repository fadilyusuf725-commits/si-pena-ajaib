// Shared guides for letters B..Z
(function(){
  // reuse drawArrowHead if not present
  function drawArrowHeadLocal(ctx, x1, y1, x2, y2, size = 12) {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - size * Math.cos(ang - Math.PI / 6), y2 - size * Math.sin(ang - Math.PI / 6));
    ctx.lineTo(x2 - size * Math.cos(ang + Math.PI / 6), y2 - size * Math.sin(ang + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  // Coordinate overlay removed per user request.

  window.drawLetterGuides = function(tctx, letter, Lx, Rx, Cy) {
    if (!tctx) return;
    tctx.save();
    // local helpers for pixel <-> Cartesian conversion using this canvas center
    const __cw = tctx.canvas.width, __ch = tctx.canvas.height;
    const __cx = Math.round(__cw / 2), __cy = Math.round(__ch / 2);
    const pxToCart = (px, py) => ({ x: Math.round(px - __cx), y: Math.round(__cy - py) });
    const cartToPx = (x, y) => ({ px: Math.round(__cx + x), py: Math.round(__cy - y) });
    // normalize helper: take a pixel coordinate, expose as Cartesian (for editing) then convert back
    const norm = (px, py) => cartToPx(...Object.values(pxToCart(px, py)));
    tctx.fillStyle = '#FF6B35';
    tctx.strokeStyle = '#FF6B35';
    tctx.lineWidth = 2;
    tctx.font = 'bold 28px Nunito, sans-serif';
    tctx.textAlign = 'center';
    tctx.textBaseline = 'middle';

    const U = letter.toUpperCase();
    const L = letter.toLowerCase();

    // Default small helper positions
    const topY = Cy - 160;
    const midY = Cy;
    const botY = Cy + 140;

    // coordinate overlay removed — no grid/Cartesian labels will be drawn

    // Helper to draw a simple curve with arrow
    function curve(fromX, fromY, cpX, cpY, toX, toY, arrowSize=12, label){
      tctx.beginPath();
      tctx.moveTo(fromX, fromY);
      tctx.quadraticCurveTo(cpX, cpY, toX, toY);
      tctx.stroke();
      drawArrowHeadLocal(tctx, cpX, cpY, toX, toY, arrowSize);
      if (label) tctx.fillText(label, (fromX+toX)/2, (fromY+toY)/2 - 18);
    }

    // Simple straight with arrow
    function straight(x1,y1,x2,y2,label){
      tctx.beginPath(); tctx.moveTo(x1,y1); tctx.lineTo(x2,y2); tctx.stroke();
      drawArrowHeadLocal(tctx, x1,y1,x2,y2,12);
      if (label) tctx.fillText(label, (x1+x2)/2, (y1+y2)/2 - 12);
    }

    // semicircle helper: draws arc and arrow at endAngle
    function semicircle(cx, cy, r, startAng, endAng, label){
      tctx.beginPath();
      tctx.arc(cx, cy, r, startAng, endAng);
      tctx.stroke();
      const ex = cx + r * Math.cos(endAng);
      const ey = cy + r * Math.sin(endAng);
      const px = cx + r * Math.cos(endAng - 0.08);
      const py = cy + r * Math.sin(endAng - 0.08);
      drawArrowHeadLocal(tctx, px, py, ex, ey, 12);
      if (label) {
        const midAng = (startAng + endAng) / 2;
        tctx.fillText(label, cx + (r * 0.7) * Math.cos(midAng), cy + (r * 0.7) * Math.sin(midAng) - 18);
      }
    }

    // helper: draw smooth curve through an array of pixel points using Catmull-Rom -> Bezier
    function drawThroughPoints(pixelPts, label) {
      if (!pixelPts || pixelPts.length < 2) return;
      tctx.beginPath();
      tctx.moveTo(pixelPts[0].px, pixelPts[0].py);
      for (let i = 0; i < pixelPts.length - 1; i++) {
        const p0 = pixelPts[i - 1] || pixelPts[i];
        const p1 = pixelPts[i];
        const p2 = pixelPts[i + 1];
        const p3 = pixelPts[i + 2] || p2;
        // Catmull-Rom to Bezier control points
        const cp1x = p1.px + (p2.px - p0.px) / 6;
        const cp1y = p1.py + (p2.py - p0.py) / 6;
        const cp2x = p2.px - (p3.px - p1.px) / 6;
        const cp2y = p2.py - (p3.py - p1.py) / 6;
        tctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.px, p2.py);
      }
      tctx.stroke();
      // arrow at end
      const last = pixelPts[pixelPts.length - 1];
      const prev = pixelPts[pixelPts.length - 2] || pixelPts[0];
      drawArrowHeadLocal(tctx, prev.px, prev.py, last.px, last.py, 12);
      if (label) {
        const mid = pixelPts[Math.floor(pixelPts.length / 2)];
        tctx.fillText(label, mid.px, mid.py - 18);
      }
    }

    // Per-letter guide approximations
    switch(U){
      case 'B': {
        // B1: shorten stem by 1cm (move bottom up)
        straight(Lx - 75, topY, Lx - 75, botY - 65, '①');

        // B2: custom curve — coordinates provided in Cartesian (center-origin)
        // convert user cartesian coords (x,y) → pixel coords (px,py)
        const __cw = tctx.canvas.width, __ch = tctx.canvas.height;
        const __cx = Math.round(__cw / 2), __cy = Math.round(__ch / 2);
        const cartToPx = (x, y) => ({ px: __cx + x, py: __cy - y });
        const p1 = cartToPx(-230, 140);
        const p2 = cartToPx(-165, 86); // desired point to pass through
        const p3 = cartToPx(-230, 30);

        // compute quadratic control point so curve from p1->p3 passes through p2 at t=0.5
        const cpx = 2 * p2.px - 0.5 * (p1.px + p3.px);
        const cpy = 2 * p2.py - 0.5 * (p1.py + p3.py);
        curve(p1.px, p1.py, cpx, cpy, p3.px, p3.py, 12, '②');

        // B3: custom curve using Cartesian points (center-origin) so it passes through desired midpoint
        const q1 = cartToPx(-230, 30);
        const q2 = cartToPx(-160, -26); // desired point to pass through
        const q3 = cartToPx(-230, -85);
        const cpx3 = 2 * q2.px - 0.5 * (q1.px + q3.px);
        const cpy3 = 2 * q2.py - 0.5 * (q1.py + q3.py);
        curve(q1.px, q1.py, cpx3, cpy3, q3.px, q3.py, 12, '③');
        }
        break;
      
      case 'C':
        // C: smooth curve that passes through 5 editable Cartesian points
        // define desired pixel anchors relative to Lx / midY, then convert
        const c_pts_px = [
          { x: Lx + 60, y: midY - 145 },
          { x: Lx - 30,  y: midY - 145  },
          { x: Lx - 80,  y: midY - 40  },
          { x: Lx - 30,  y: midY + 66  },
          { x: Lx + 60, y: midY + 66 }
        ].map(p => ({ px: p.x, py: p.y }));
        // convert pixel anchors to Cartesian and back to normalized pixels (keeps editing UX)
        const c_pixels = c_pts_px.map(pt => cartToPx(...Object.values(pxToCart(pt.px, pt.py))));
        drawThroughPoints(c_pixels, '①');
        break;
      case 'D':
        // D: vertical stem (①) and a smooth outer curve drawn through 5 editable anchors (②)
        const d1p = norm(Lx - 85, topY);
        const d2p = norm(Lx - 85, botY - 65);
        straight(d1p.px, d1p.py, d2p.px, d2p.py, '①');

        // five anchor points (pixel coords relative to Lx/midY) — editable via overlay
        const D_pts = [
          { px: Lx - 40, py: topY + 8 },
          { px: Lx + 40, py: topY + 25 },
          { px: Lx + 100, py: midY - 45 },
          { px: Lx + 40, py: botY - 80 },
          { px: Lx - 40, py: botY - 70 }
        ].map(p => norm(p.px, p.py));
        drawThroughPoints(D_pts, '②');
        break;
      case 'E':
        // E: simplified stem + three horizontals (top, middle, bottom)
        // stem
        const eStemTop = norm(Lx - 57, topY + 15);
        const eStemBot = norm(Lx - 57, botY - 70);
        straight(eStemTop.px, eStemTop.py, eStemBot.px, eStemBot.py, '①');
        // top bar
        const eTopStart = norm(Lx - 60, topY + 10);
        const eTopEnd = norm(Lx + 60, topY + 10);
        straight(eTopStart.px, eTopStart.py, eTopEnd.px, eTopEnd.py, '②');
        // middle bar
        const eMidStart = norm(Lx - 40, midY - 40);
        const eMidEnd = norm(Lx + 50, midY - 40);
        straight(eMidStart.px, eMidStart.py, eMidEnd.px, eMidEnd.py, '③');
        // bottom bar
        const eBotStart = norm(Lx - 60, botY - 70);
        const eBotEnd = norm(Lx + 60, botY - 70);
        straight(eBotStart.px, eBotStart.py, eBotEnd.px, eBotEnd.py, '④');
        break;
      case 'F':
        const f1p = norm(Lx - 52, topY + 10);
        const f2p = norm(Lx - 52, botY - 60);
        straight(f1p.px, f1p.py, f2p.px, f2p.py, '①');
        const f3p = norm(Lx - 53, topY + 10);
        const f4p = norm(Lx + 70, topY + 10);
        straight(f3p.px, f3p.py, f4p.px, f4p.py, '②');
        const f5p = norm(Lx - 53, midY - 40);
        const f6p = norm(Lx + 60, midY - 40);
        straight(f5p.px, f5p.py, f6p.px, f6p.py, '③');
        break;
      case 'G':
        // G1: outer curve through five editable anchors for finer control
        const G_pts = [
          norm(Lx + 75, midY - 140),
          norm(Lx - 53, midY - 135),
          norm(Lx - 80, midY + 30),
          norm(Lx + 70, midY + 72),
          norm(Lx + 84, midY - 25)
        ];
        drawThroughPoints(G_pts, '①');
        const g4p = norm(Lx + 89, midY - 32);
        const g5p = norm(Lx + 18, midY - 32);
        straight(g4p.px, g4p.py, g5p.px, g5p.py, '②');
        break;
      case 'H':
        const h1p = norm(Lx - 88, topY + 10);
        const h2p = norm(Lx - 88, botY - 65);
        straight(h1p.px, h1p.py, h2p.px, h2p.py, '①');
        const h3p = norm(Lx + 88, topY + 10);
        const h4p = norm(Lx + 88, botY - 65);
        straight(h3p.px, h3p.py, h4p.px, h4p.py, '③');
        const h5p = norm(Lx - 70, midY - 40);
        const h6p = norm(Lx + 70, midY - 40);
        straight(h5p.px, h5p.py, h6p.px, h6p.py, '②');
        break;
      case 'I':
        const i1p = norm(Lx, topY + 10);
        const i2p = norm(Lx, botY - 65);
        straight(i1p.px, i1p.py, i2p.px, i2p.py, '①');
        break;
      case 'J':
        const j3_cart = pxToCart(Lx + 10, topY + 10);
        const j4_cart = pxToCart(Lx + 7, midY + 33);
        const j5_cart = pxToCart(Lx - 45, botY - 69);
        const j3p = cartToPx(j3_cart.x, j3_cart.y);
        const j4p = cartToPx(j4_cart.x, j4_cart.y);
        const j5p = cartToPx(j5_cart.x, j5_cart.y);
        const jcpx = 2 * j4p.px - 0.5 * (j3p.px + j5p.px);
        const jcpy = 2 * j4p.py - 0.5 * (j3p.py + j5p.py);
        curve(j3p.px, j3p.py, jcpx, jcpy, j5p.px, j5p.py, 12, '①');
        break;
      case 'K':
        const k1p = norm(Lx - 65, topY + 10);
        const k2p = norm(Lx - 65, botY - 65);
        straight(k1p.px, k1p.py, k2p.px, k2p.py, '①');
        const k3p = norm(Lx - 50, midY - 36);
        const k4p = norm(Lx + 85, topY + 2);
        straight(k3p.px, k3p.py, k4p.px, k4p.py, '②');
        const k5p = norm(Lx - 40, midY - 40);
        const k6p = norm(Lx + 85, botY - 65);
        straight(k5p.px, k5p.py, k6p.px, k6p.py, '③');
        break;
      case 'L':
        const l1p = norm(Lx - 50, topY + 10);
        const l2p = norm(Lx - 50, botY - 75);
        straight(l1p.px, l1p.py, l2p.px, l2p.py, '①');
        const l3p = norm(Lx - 50, botY - 68);
        const l4p = norm(Lx + 80, botY - 68);
        straight(l3p.px, l3p.py, l4p.px, l4p.py, '②');
        break;
      case 'M':
        const m1p = norm(Lx - 107, botY - 65);
        const m2p = norm(Lx - 107, topY + 10);
        straight(m1p.px, m1p.py, m2p.px, m2p.py, '①');
        const m3p = norm(Lx - 100, topY + 10);
        const m4p = norm(Lx - 0, midY + 37);
        straight(m3p.px, m3p.py, m4p.px, m4p.py, '②');
        const m5p = norm(Lx + 10, midY + 21);
        const m6p = norm(Lx + 100, topY + 10);
        straight(m5p.px, m5p.py, m6p.px, m6p.py, '③');
        const m7p = norm(Lx + 107, topY + 10);
        const m8p = norm(Lx + 107, botY - 65);
        straight(m7p.px, m7p.py, m8p.px, m8p.py, '④');
        break;
      case 'N':
        const n1p = norm(Lx - 87, botY - 65);
        const n2p = norm(Lx - 87, topY + 10);
        straight(n1p.px, n1p.py, n2p.px, n2p.py, '①');
        const n3p = norm(Lx - 82, topY + 10);
        const n4p = norm(Lx + 84, botY - 65);
        straight(n3p.px, n3p.py, n4p.px, n4p.py, '②');
        const n5p = norm(Lx + 87, botY - 65);
        const n6p = norm(Lx + 87, topY + 10);
        straight(n5p.px, n5p.py, n6p.px, n6p.py, '③');
        break;
      case 'O':
        // Draw a full circular guide with an arrow at the end
        try {
          semicircle(Lx, midY - 40, 108, -Math.PI/2, -Math.PI/2 + Math.PI * 1.9, '①');
        } catch (e) {
          // fallback to previous three-point curve
          const o1_cart = pxToCart(Lx, midY - 120);
          const o2_cart = pxToCart(Lx - 80, midY - 120);
          const o3_cart = pxToCart(Lx, midY + 120);
          const o1p = cartToPx(o1_cart.x, o1_cart.y);
          const o2p = cartToPx(o2_cart.x, o2_cart.y);
          const o3p = cartToPx(o3_cart.x, o3_cart.y);
          const ocpx = 2 * o2p.px - 0.5 * (o1p.px + o3p.px);
          const ocpy = 2 * o2p.py - 0.5 * (o1p.py + o3p.py);
          curve(o1p.px, o1p.py, ocpx, ocpy, o3p.px, o3p.py, 12, '①');
        }
        break;
      case 'P':
        const p1p = norm(Lx - 67, topY + 10);
        const p2p = norm(Lx - 67, botY - 65);
        straight(p1p.px, p1p.py, p2p.px, p2p.py, '①');
        const p3_cart = pxToCart(Lx - 60, topY + 10);
        const p4_cart = pxToCart(Lx + 80, midY - 80);
        const p5_cart = pxToCart(Lx - 60, midY - 25);
        const p3p = cartToPx(p3_cart.x, p3_cart.y);
        const p4p = cartToPx(p4_cart.x, p4_cart.y);
        const p5p = cartToPx(p5_cart.x, p5_cart.y);
        const pcpx = 2 * p4p.px - 0.5 * (p3p.px + p5p.px);
        const pcpy = 2 * p4p.py - 0.5 * (p3p.py + p5p.py);
        curve(p3p.px, p3p.py, pcpx, pcpy, p5p.px, p5p.py, 12, '②');
        break;
      case 'Q':
        // Circle guide with arrow, plus a tail for the Q
        try {
          semicircle(Lx, midY, 120, -Math.PI/2, -Math.PI/2 + Math.PI * 2, '①');
        } catch (e) {
          const q1_cart = pxToCart(Lx, midY - 120);
          const q2_cart = pxToCart(Lx - 80, midY);
          const q3_cart = pxToCart(Lx, midY + 120);
          const q1p = cartToPx(q1_cart.x, q1_cart.y);
          const q2p = cartToPx(q2_cart.x, q2_cart.y);
          const q3p = cartToPx(q3_cart.x, q3_cart.y);
          const qcpx = 2 * q2p.px - 0.5 * (q1p.px + q3p.px);
          const qcpy = 2 * q2p.py - 0.5 * (q1p.py + q3p.py);
          curve(q1p.px, q1p.py, qcpx, qcpy, q3p.px, q3p.py, 12, '①');
        }
        const q4p = norm(Lx + 30, midY + 60);
        const q5p = norm(Lx + 80, midY + 120);
        straight(q4p.px, q4p.py, q5p.px, q5p.py, '②');
        break;
      case 'R':
        const r1p = norm(Lx - 100, botY);
        const r2p = norm(Lx - 100, topY);
        straight(r1p.px, r1p.py, r2p.px, r2p.py, '①');
        const r3_cart = pxToCart(Lx - 60, topY + 30);
        const r4_cart = pxToCart(Lx + 10, midY);
        const r5_cart = pxToCart(Lx - 60, midY + 30);
        const r3p = cartToPx(r3_cart.x, r3_cart.y);
        const r4p = cartToPx(r4_cart.x, r4_cart.y);
        const r5p = cartToPx(r5_cart.x, r5_cart.y);
        const rcpx = 2 * r4p.px - 0.5 * (r3p.px + r5p.px);
        const rcpy = 2 * r4p.py - 0.5 * (r3p.py + r5p.py);
        curve(r3p.px, r3p.py, rcpx, rcpy, r5p.px, r5p.py, 12, '②');
        const r6p = norm(Lx - 20, midY);
        const r7p = norm(Lx + 60, botY);
        straight(r6p.px, r6p.py, r7p.px, r7p.py, '③');
        break;
      case 'S':
        const s1_cart = pxToCart(Lx + 40, topY);
        const s2_cart = pxToCart(Lx - 20, midY - 40);
        const s3_cart = pxToCart(Lx + 40, midY + 20);
        const s1p = cartToPx(s1_cart.x, s1_cart.y);
        const s2p = cartToPx(s2_cart.x, s2_cart.y);
        const s3p = cartToPx(s3_cart.x, s3_cart.y);
        const scpx = 2 * s2p.px - 0.5 * (s1p.px + s3p.px);
        const scpy = 2 * s2p.py - 0.5 * (s1p.py + s3p.py);
        curve(s1p.px, s1p.py, scpx, scpy, s3p.px, s3p.py, 12, '①');
        const s4_cart = pxToCart(Lx + 40, midY + 20);
        const s5_cart = pxToCart(Lx - 20, botY);
        const s6_cart = pxToCart(Lx + 40, botY);
        const s4p = cartToPx(s4_cart.x, s4_cart.y);
        const s5p = cartToPx(s5_cart.x, s5_cart.y);
        const s6p = cartToPx(s6_cart.x, s6_cart.y);
        const sc2px = 2 * s5p.px - 0.5 * (s4p.px + s6p.px);
        const sc2py = 2 * s5p.py - 0.5 * (s4p.py + s6p.py);
        curve(s4p.px, s4p.py, sc2px, sc2py, s6p.px, s6p.py, 12, '②');
        break;
      case 'T':
        const t1p = norm(Lx, topY);
        const t2p = norm(Lx, botY);
        straight(t1p.px, t1p.py, t2p.px, t2p.py, '①');
        const t3p = norm(Lx - 80, topY);
        const t4p = norm(Lx + 80, topY);
        straight(t3p.px, t3p.py, t4p.px, t4p.py, '②');
        break;
      case 'U':
        const u1_cart = pxToCart(Lx - 60, topY);
        const u2_cart = pxToCart(Lx - 60, botY - 20);
        const u3_cart = pxToCart(Lx, botY);
        const u1p = cartToPx(u1_cart.x, u1_cart.y);
        const u2p = cartToPx(u2_cart.x, u2_cart.y);
        const u3p = cartToPx(u3_cart.x, u3_cart.y);
        const ucpx = 2 * u2p.px - 0.5 * (u1p.px + u3p.px);
        const ucpy = 2 * u2p.py - 0.5 * (u1p.py + u3p.py);
        curve(u1p.px, u1p.py, ucpx, ucpy, u3p.px, u3p.py, 12, '①');
        const u4_cart = pxToCart(Lx, botY);
        const u5_cart = pxToCart(Lx + 60, botY - 20);
        const u6_cart = pxToCart(Lx + 60, topY);
        const u4p = cartToPx(u4_cart.x, u4_cart.y);
        const u5p = cartToPx(u5_cart.x, u5_cart.y);
        const u6p = cartToPx(u6_cart.x, u6_cart.y);
        const uc2px = 2 * u5p.px - 0.5 * (u4p.px + u6p.px);
        const uc2py = 2 * u5p.py - 0.5 * (u4p.py + u6p.py);
        curve(u4p.px, u4p.py, uc2px, uc2py, u6p.px, u6p.py, 12, '②');
        break;
      case 'V':
        const v1p = norm(Lx - 80, topY);
        const v2p = norm(Lx, botY);
        straight(v1p.px, v1p.py, v2p.px, v2p.py, '①');
        const v3p = norm(Lx, botY);
        const v4p = norm(Lx + 80, topY);
        straight(v3p.px, v3p.py, v4p.px, v4p.py, '②');
        break;
      case 'W':
        const w1p = norm(Lx - 100, topY);
        const w2p = norm(Lx - 40, botY);
        straight(w1p.px, w1p.py, w2p.px, w2p.py, '①');
        const w3p = norm(Lx - 40, botY);
        const w4p = norm(Lx + 20, topY);
        straight(w3p.px, w3p.py, w4p.px, w4p.py, '②');
        const w5p = norm(Lx + 20, topY);
        const w6p = norm(Lx + 80, botY);
        straight(w5p.px, w5p.py, w6p.px, w6p.py, '③');
        const w7p = norm(Lx + 80, botY);
        const w8p = norm(Lx + 140, topY);
        straight(w7p.px, w7p.py, w8p.px, w8p.py, '④');
        break;
      case 'X':
        const x1p = norm(Lx - 60, topY);
        const x2p = norm(Lx + 60, botY);
        straight(x1p.px, x1p.py, x2p.px, x2p.py, '①');
        const x3p = norm(Lx + 60, topY);
        const x4p = norm(Lx - 60, botY);
        straight(x3p.px, x3p.py, x4p.px, x4p.py, '②');
        break;
      case 'Y':
        const y1p = norm(Lx - 80, topY);
        const y2p = norm(Lx, midY);
        straight(y1p.px, y1p.py, y2p.px, y2p.py, '①');
        const y3p = norm(Lx + 80, topY);
        const y4p = norm(Lx, midY);
        straight(y3p.px, y3p.py, y4p.px, y4p.py, '②');
        const y5p = norm(Lx, midY);
        const y6p = norm(Lx, botY);
        straight(y5p.px, y5p.py, y6p.px, y6p.py, '③');
        break;
      case 'Z':
        const z1p = norm(Lx - 60, topY);
        const z2p = norm(Lx + 60, topY);
        straight(z1p.px, z1p.py, z2p.px, z2p.py, '①');
        const z3p = norm(Lx + 60, topY);
        const z4p = norm(Lx - 60, botY);
        straight(z3p.px, z3p.py, z4p.px, z4p.py, '②');
        const z5p = norm(Lx - 60, botY);
        const z6p = norm(Lx + 60, botY);
        straight(z5p.px, z5p.py, z6p.px, z6p.py, '③');
        break;
      default:
        // no generic uppercase hints here — per-letter cases draw their own hints
        break;
    }

    // Also handle lowercase-specific quick hints for some letters
    switch(L){
      case 'a':
        // small a: keep first marker, replace second with a smooth loop like d's ②
        const a1_cart = pxToCart(Rx + 40, Cy);
        const a1p = cartToPx(a1_cart.x, a1_cart.y);
        tctx.fillText('①', a1p.px, a1p.py);

        // loop anchors for the round part of 'a' (normalized so they're editable)
        const a_loop1 = norm(Rx + 10, midY - 30);
        const a_loop2 = norm(Rx - 20, midY );
        const a_loop3 = norm(Rx - 40, midY + 80);
        const a_loop4 = norm(Rx - 10, midY + 40);
        const a_loop5 = norm(Rx + 30, midY + 30);
        const aLoopPoints = [a_loop1, a_loop2, a_loop3, a_loop4, a_loop5];
        drawThroughPoints(aLoopPoints, '②');

        // draw visible numbered markers on the five anchor points
        try {
          tctx.save();
          tctx.fillStyle = '#FF6B35';
          tctx.strokeStyle = '#ffffff';
          tctx.lineWidth = 2;
          tctx.font = 'bold 14px Nunito, sans-serif';
          tctx.textAlign = 'center';
          tctx.textBaseline = 'middle';
          for (let i = 0; i < aLoopPoints.length; i++) {
            const p = aLoopPoints[i];
            if (!p) continue;
            tctx.beginPath();
            tctx.arc(p.px, p.py, 8, 0, Math.PI * 2);
            tctx.fill();
            tctx.stroke();
            tctx.fillStyle = '#ffffff';
            tctx.fillText(String(i + 1), p.px, p.py);
            tctx.fillStyle = '#FF6B35';
          }
        } catch (e) { /* ignore drawing errors */ }
        
        break;
      case 'b':
        straight(Rx - 60, topY, Rx - 60, botY - 65, '①');
        // Make loop pass through a nicer midpoint: compute quadratic control
        const bp1 = { x: Rx + 13, y: midY - 82 };
        const bp2 = { x: Rx + 75, y: midY };// desired midpoint (to the right)
        const bp3 = { x: Rx + 15, y: midY + 78 };
        const bcp_x = 2 * bp2.x - 0.5 * (bp1.x + bp3.x);
        const bcp_y = 2 * bp2.y - 0.5 * (bp1.y + bp3.y);
        curve(bp1.x, bp1.y, bcp_x, bcp_y, bp3.x, bp3.y, 10, '②');
        break;
      case 'c':
        // small lowercase c: three anchors, drawn as smooth spline; only label ①
        const csp1 = cartToPx(...Object.values(pxToCart(Rx + 20, midY - 76)));
        const csp2 = cartToPx(...Object.values(pxToCart(Rx - 15, midY - 72)));
        const csp3 = cartToPx(...Object.values(pxToCart(Rx - 53, midY)));
        const csp4 = cartToPx(...Object.values(pxToCart(Rx - 10, midY + 70)));
        const csp5 = cartToPx(...Object.values(pxToCart(Rx + 20, midY + 76)));
        drawThroughPoints([csp1, csp2, csp3, csp4, csp5], '①');
        break;
      case 'd':
        // small d: vertical stem + outer loop drawn through 5 anchors (no duplicated numeric labels)
        straight(Rx + 60, topY + 10, Rx + 60, botY - 65, '①');
        const dpt1 = norm(Rx + 10, midY - 75);
        const dpt2 = norm(Rx - 35, midY - 70);
        const dpt3 = norm(Rx - 75, midY - 15);
        const dpt4 = norm(Rx - 40, midY + 70);
        const dpt5 = norm(Rx + 10, midY + 75);
        drawThroughPoints([dpt1, dpt2, dpt3, dpt4, dpt5], '②');
        break;
      case 'e':
        // small e: a rounded loop; single smooth spline through five anchors
        const e_small_p1 = norm(Rx + 70, midY - 30);
        const e_small_p2 = norm(Rx + 10, midY - 80);
        const e_small_p3 = norm(Rx - 68, midY - 17);
        const e_small_p4 = norm(Rx - 20, midY + 72);
        const e_small_p5 = norm(Rx + 60, midY + 65);
        drawThroughPoints([e_small_p1, e_small_p2, e_small_p3, e_small_p4, e_small_p5], '②');
        // Add a short straight directional guide showing initial leftward stroke
        try {
          const e_line_start = norm(Rx - 40, midY - 6);
          const e_line_end = norm(Rx + 69, midY - 6);
          straight(e_line_start.px, e_line_start.py, e_line_end.px, e_line_end.py, '①');
        } catch (e) { /* ignore if drawing fails */ }
        break;
      case 'f':
        // small f: top bar and vertical stem
        const f_top_s = norm(Rx - 50, topY + 86);
        const f_top_e = norm(Rx + 45, topY + 86);
        straight(f_top_s.px, f_top_s.py, f_top_e.px, f_top_e.py, '①');
        const f_stem_s = norm(Rx + 50, topY + 5);
        const f_stem_e = norm(Rx - 10, botY - 60);
        // make the stem slightly curved near the top for a gentler shape
        try {
          // use a normalized control point (cartesian-relative) for more predictable curvature
          const f_cp = norm(Rx - 30, topY - 10 );
          curve(f_stem_s.px, f_stem_s.py, f_cp.px, f_cp.py, f_stem_e.px, f_stem_e.py, 12, '②');
        } catch (e) {
          // fallback to straight if anything goes wrong
          straight(f_stem_s.px, f_stem_s.py, f_stem_e.px, f_stem_e.py, '②');
        }
        break;
      case 'g':
        // small g: round loop + tail
        const g1 = norm(Rx + 50, midY - 50);
        const g2 = norm(Rx - 30, midY - 75);
        const g3 = norm(Rx - 70, midY + 15);
        const g4 = norm(Rx - 10, midY + 70);
        const g5 = norm(Rx + 40, midY + 50);
        drawThroughPoints([g1, g2, g3, g4, g5], '①');
        // small tail — make it a standalone guide with its own anchors (independent from G1)
        try {
          const tailStart = norm(Rx + 60, midY - 60);
          const tailCp = norm(Rx + 95, midY + 195);
          const tailEnd = norm(Rx - 60, midY + 125);
          curve(tailStart.px, tailStart.py, tailCp.px, tailCp.py, tailEnd.px, tailEnd.py, 10, '②');
        } catch (e) {
          const tailStart = norm(Rx + 60, midY + 20);
          const tailEnd = norm(Rx + 100, midY + 100);
          straight(tailStart.px, tailStart.py, tailEnd.px, tailEnd.py, '②');
        }
        break;
      case 'h':
        // small h: stem + right arch
        const h1 = norm(Rx - 60, topY + 10);
        const h2 = norm(Rx - 60, botY - 65);
        straight(h1.px, h1.py, h2.px, h2.py, '①');
        const h_p1 = norm(Rx - 42, midY - 55);
        const h_p2 = norm(Rx + 20, midY - 78);
        const h_p3 = norm(Rx + 58, midY - 30);
        const h_p4 = norm(Rx + 60, midY + 72);
        drawThroughPoints([h_p1, h_p2, h_p3, h_p4], '②');
        break;
      case 'i':
        // small i: short vertical + dot
        const i1 = norm(Rx, topY + 85);
        const i2 = norm(Rx, midY + 70);
        straight(i1.px, i1.py, i2.px, i2.py, '①');
        try { const dot = cartToPx(...Object.values(pxToCart(Rx, topY + 17))); tctx.fillText('●', dot.px, dot.py); } catch(e){}
        break;
      case 'j':
        // small j: downward tail with a dot above (like 'i')
        const j1 = norm(Rx, topY + 90);
        const j_mid = norm(Rx, midY + 105);
        const j2 = norm(Rx - 47, botY + 3 );
        drawThroughPoints([j1, j_mid, j2], '①');
        // add a dot above the stroke similar to small 'i'
        try {
          const j_dot = cartToPx(...Object.values(pxToCart(Rx, topY + 17)));
          tctx.fillText('●', j_dot.px, j_dot.py);
        } catch (e) { /* ignore drawing errors */ }
        break;
      case 'k':
        // match uppercase K layout scaled to lowercase area
        const k1p = norm(Rx - 48, topY + 10);
        const k2p = norm(Rx - 48, botY - 65);
        straight(k1p.px, k1p.py, k2p.px, k2p.py, '①');
        const k3p = norm(Rx - 20, midY - 5);
        const k4p = norm(Rx + 60, topY + 80);
        straight(k3p.px, k3p.py, k4p.px, k4p.py, '②');
        const k5p = norm(Rx - 37, midY - 18);
        const k6p = norm(Rx + 60, botY - 65);
        straight(k5p.px, k5p.py, k6p.px, k6p.py, '③');
        break;
      case 'l':
        // small l: simple vertical
        straight(norm(Rx - 10, topY + 20).px, norm(Rx - 10, topY + 20).py, norm(Rx - 10, botY - 60).px, norm(Rx - 10, botY - 80).py, '①');
        break;
      case 'm':
        // small m: three guides — ① straight baseline, ② and ③ are 4-point editable splines
        // ① baseline (straight)
        const m_line_start = norm(Rx - 108, botY - 65);
        const m_line_end = norm(Rx - 108, topY + 80);
        straight(m_line_start.px, m_line_start.py, m_line_end.px, m_line_end.py, '①');

        // ② first hump (4 anchors)
        const m_a1 = norm(Rx - 100, midY - 45);
        const m_a2 = norm(Rx - 65, midY - 75);
        const m_a3 = norm(Rx - 5, midY - 55);
        const m_a4 = norm(Rx + 0, midY + 75);
        drawThroughPoints([m_a1, m_a2, m_a3, m_a4], '②');

        // ③ second hump (4 anchors)
        const m_b1 = norm(Rx + 10, midY - 40);
        const m_b2 = norm(Rx + 45, midY - 75);
        const m_b3 = norm(Rx + 105, midY - 55);
        const m_b4 = norm(Rx + 110, midY + 75);
        drawThroughPoints([m_b1, m_b2, m_b3, m_b4], '③');
        break;
      case 'n':
        // small n: up then down
         const n_line_start = norm(Rx - 60, botY - 65);
        const n_line_end = norm(Rx - 60, topY + 80);
        straight(n_line_start.px, n_line_start.py, n_line_end.px, n_line_end.py, '①');

        // ② first hump (4 anchors)
        const n_a1 = norm(Rx - 52, midY - 35);
        const n_a2 = norm(Rx - 12, midY - 74);
        const n_a3 = norm(Rx + 54, midY - 55);
        const n_a4 = norm(Rx + 59, midY + 75);
        drawThroughPoints([n_a1, n_a2, n_a3, n_a4], '②');
        break;
      case 'o':
        // small o: circular guide with an arrow (fallback to spline if semicircle fails)
        try {
          semicircle(Rx, midY, 75, -Math.PI/2, -Math.PI/2 + Math.PI * 1.9, '①');
        } catch (e) {
          const o1 = norm(Rx, midY - 40);
          const o2 = norm(Rx - 40, midY);
          const o3 = norm(Rx, midY + 40);
          const o4 = norm(Rx + 40, midY);
          drawThroughPoints([o1, o2, o3, o4, o1], '①');
        }
        break;
      case 'p':
        // small p: stem + loop above baseline
        straight(norm(Rx - 60, topY - 10).px, norm(Rx - 60, topY - 10).py, norm(Rx - 60, midY + 40).px, norm(Rx - 60, midY + 40).py, '①');
        drawThroughPoints([norm(Rx - 20, topY + 10), norm(Rx + 20, topY + 10), norm(Rx + 20, midY + 30), norm(Rx - 20, midY + 30), norm(Rx - 20, topY + 10)], '②');
        break;
      case 'q':
        // small q: circle + tail down-right
        drawThroughPoints([norm(Rx, midY - 40), norm(Rx - 40, midY), norm(Rx, midY + 40), norm(Rx + 40, midY)], '①');
        straight(norm(Rx + 40, midY).px, norm(Rx + 40, midY).py, norm(Rx + 70, midY + 50).px, norm(Rx + 70, midY + 50).py, '②');
        break;
      case 'r':
        // small r: short stem + arc
        straight(norm(Rx - 60, midY - 10).px, norm(Rx - 60, midY - 10).py, norm(Rx - 60, midY + 40).px, norm(Rx - 60, midY + 40).py, '①');
        drawThroughPoints([norm(Rx - 20, midY - 10), norm(Rx + 10, midY), norm(Rx - 10, midY + 20)], '②');
        break;
      case 's':
        // small s: S-curve
        drawThroughPoints([norm(Rx + 30, midY - 30), norm(Rx - 10, midY - 10), norm(Rx + 20, midY + 20), norm(Rx - 10, midY + 40)], '①');
        break;
      case 't':
        // small t: vertical + short top
        straight(norm(Rx, topY - 20).px, norm(Rx, topY - 20).py, norm(Rx, botY + 10).px, norm(Rx, botY + 10).py, '①');
        straight(norm(Rx - 30, topY - 30).px, norm(Rx - 30, topY - 30).py, norm(Rx + 30, topY - 30).px, norm(Rx + 30, topY - 30).py, '②');
        break;
      case 'u':
        // small u: gentle U-shape
        drawThroughPoints([norm(Rx - 40, midY - 10), norm(Rx - 20, midY + 40), norm(Rx + 20, midY + 40), norm(Rx + 40, midY - 10)], '①');
        break;
      case 'v':
        // small v: simple vee
        straight(norm(Rx - 40, topY).px, norm(Rx - 40, topY).py, norm(Rx, botY).px, norm(Rx, botY).py, '①');
        straight(norm(Rx, botY).px, norm(Rx, botY).py, norm(Rx + 40, topY).px, norm(Rx + 40, topY).py, '②');
        break;
      case 'w':
        // small w: double vee
        drawThroughPoints([norm(Rx - 80, topY), norm(Rx - 40, botY), norm(Rx, topY), norm(Rx + 40, botY), norm(Rx + 80, topY)], '①');
        break;
      case 'x':
        // small x: crossing lines
        straight(norm(Rx - 40, topY).px, norm(Rx - 40, topY).py, norm(Rx + 40, botY).px, norm(Rx + 40, botY).py, '①');
        straight(norm(Rx + 40, topY).px, norm(Rx + 40, topY).py, norm(Rx - 40, botY).px, norm(Rx - 40, botY).py, '②');
        break;
      case 'y':
        // small y: upper vee + descending tail
        drawThroughPoints([norm(Rx - 40, topY), norm(Rx, midY), norm(Rx + 40, topY)], '①');
        straight(norm(Rx, midY).px, norm(Rx, midY).py, norm(Rx, midY + 80).px, norm(Rx, midY + 80).py, '②');
        break;
      case 'z':
        // small z: zig-zag
        straight(norm(Rx - 40, topY).px, norm(Rx - 40, topY).py, norm(Rx + 40, topY).px, norm(Rx + 40, topY).py, '①');
        straight(norm(Rx + 40, topY).px, norm(Rx + 40, topY).py, norm(Rx - 40, botY).px, norm(Rx - 40, botY).py, '②');
        straight(norm(Rx - 40, botY).px, norm(Rx - 40, botY).py, norm(Rx + 40, botY).px, norm(Rx + 40, botY).py, '③');
        break;
      // more lowercase approximations can be added as needed
      default:
        // default lowercase numbered hints exposed as Cartesian points
        const l1_cart = pxToCart(Rx, Cy - 60);
        const l2_cart = pxToCart(Rx, Cy);
        const l3_cart = pxToCart(Rx, Cy + 60);
        const l1p = cartToPx(l1_cart.x, l1_cart.y);
        const l2p = cartToPx(l2_cart.x, l2_cart.y);
        const l3p = cartToPx(l3_cart.x, l3_cart.y);
        tctx.fillText('①', l1p.px, l1p.py);
        break;
    }

    tctx.restore();
  };
})();

// Persistent background-music state across page navigations
// Restores `bgm` playback/time from localStorage and keeps state saved.
(function(){
  function safeGet(key, def){ try { return localStorage.getItem(key) ?? def; } catch(e){ return def; } }
  function safeSet(key, val){ try { localStorage.setItem(key, val); } catch(e){} }

  // Provide a global `audioOn` binding early so letter scripts can read it synchronously.
  try {
    var __initialAudioOn = false;
    try { __initialAudioOn = safeGet('bgmPlaying','0') === '1'; } catch(e){}
    // set both a true global var and window property
    window.__bgm_playing = window.__bgm_playing || __initialAudioOn;
    window.audioOn = (window.audioOn !== undefined) ? window.audioOn : !!window.__bgm_playing;
    // also expose a true global variable binding `audioOn` (use indirect eval to create global var)
    try {
      (0, eval)('var audioOn = ' + (window.audioOn ? 'true' : 'false') + ';');
    } catch(e){}
  } catch(e){}

  window.addEventListener('load', () => {
    try {
      // Ensure a global `bgm` exists (many pages create `bgm` themselves)
      if (!window.bgm) {
        const url = window.BG_MUSIC || 'https://cdn.pixabay.com/download/audio/2025/03/30/audio_3d2ec07913.mp3?filename=spring-in-my-step-copyright-free-music-for-youtube-320726.mp3';
        window.bgm = document.getElementById('bgm') || new Audio(url);
      }
      // Diagnostic: expose when bgm was initialized and basic state
      try { window.__bgm_diagnostics = window.__bgm_diagnostics || {}; } catch(e){}
      try { window.__bgm_diagnostics.createdOn = window.__bgm_diagnostics.createdOn || Date.now(); } catch(e){}
      const bgm = window.bgm;
      bgm.loop = true;
      bgm.preload = 'auto';

      // Diagnostic logging: basic info for debugging autoplay across pages
      try {
        console.info('[guides.js] bgm:', {
          exists: !!window.bgm,
          src: bgm && (bgm.src || bgm.currentSrc || '(no-src)'),
          paused: !!(bgm && bgm.paused),
          readyState: bgm && bgm.readyState
        });
        window.__bgm_diagnostics.src = bgm && (bgm.src || bgm.currentSrc || '(no-src)');
        window.__bgm_diagnostics.paused = !!(bgm && bgm.paused);
      } catch(e){}

      // restore time and play state
      const savedTime = parseFloat(safeGet('bgmTime','0')) || 0;
      try { if (!isNaN(savedTime) && savedTime > 0) bgm.currentTime = savedTime; } catch(e){}

      // check for music button early so we can update UI when autoplay is blocked
      const musicBtn = document.getElementById('musicBtn') || document.getElementById('audioBtn');

      const wasPlaying = safeGet('bgmPlaying','0') === '1';
      if (wasPlaying) {
        // Attempt to autoplay; if blocked we'll register a one-time gesture to resume.
        bgm.play().then(() => {
          try { console.info('[guides.js] bgm.play() succeeded on load'); } catch(e){}
          try { window.__bgm_diagnostics.autoplaySucceeded = true; window.__bgm_diagnostics.paused = false; } catch(e){}
        }).catch((err) => {
          try { console.warn('[guides.js] bgm.play() blocked on load', err); } catch(e){}
          try { window.__bgm_diagnostics.autoplayBlocked = true; } catch(e){}
          // Autoplay blocked — resume on first user gesture
          try {
            if (musicBtn) musicBtn.textContent = '▶';
          } catch(e){}
          const resume = () => {
            bgm.play().then(() => {
              try { console.info('[guides.js] bgm.play() resumed via user gesture'); } catch(e){}
              try { window.__bgm_diagnostics.resumedByGesture = Date.now(); window.__bgm_diagnostics.paused = false; } catch(e){}
              try { if (musicBtn) musicBtn.textContent = '🔊'; } catch(e){}
            }).catch(()=>{});
          };
          document.addEventListener('click', resume, { once: true });
          document.addEventListener('touchstart', resume, { once: true });
          document.addEventListener('keydown', resume, { once: true });
        });
      }

      // sync visual button if present
      if (musicBtn) musicBtn.textContent = bgm.paused ? '🎵' : '🔊';

      // expose global quick flags for letter scripts to read (diagnostic)
      try { window.__bgm_diagnostics.paused = !!bgm.paused; window.__bgm_playing = !bgm.paused; window.audioOn = !!(!bgm.paused); } catch(e){}
      try { console.info('[guides.js] global audioOn=', window.audioOn); } catch(e){}

      // update saved time every second
      setInterval(() => {
        try { safeSet('bgmTime', String(bgm.currentTime || 0)); } catch(e){}
      }, 1000);

      // save play state on navigation/hide
      function saveState(){ safeSet('bgmPlaying', bgm && !bgm.paused ? '1' : '0'); safeSet('bgmTime', String(bgm.currentTime || 0)); }
      window.addEventListener('beforeunload', saveState);
      window.addEventListener('pagehide', saveState);
      document.addEventListener('visibilitychange', saveState);

      // if page provides a music button, keep localStorage in sync when user toggles
      if (musicBtn) {
        musicBtn.addEventListener('click', () => {
          try { safeSet('bgmPlaying', bgm && !bgm.paused ? '1' : '0'); safeSet('bgmTime', String(bgm.currentTime || 0)); } catch(e){}
        });
      }
    } catch (e) { /* ignore errors */ }
  });
})();