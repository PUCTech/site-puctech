// Cenas ASCII que aparecem no topo da home, entre uma exibição e outra do "PUCTech".
//
// Cada cena é uma função (largura, altura, proporção da célula) que devolve
// outra função: a cada quadro ela recebe o tempo da cena (s) e o intervalo (s)
// e devolve a grade inteira (largura × altura), com " " nas células vazias.

export type Frame = (t: number, dt: number) => string[];
export type Scene = { command: string; make: (w: number, h: number, cellRatio: number) => Frame };

const blank = (w: number, h: number) => new Array<string>(w * h).fill(" ");

/** Escreve um texto na grade, cortando o que sair dela. */
function write(cells: string[], w: number, h: number, x: number, y: number, text: string) {
  if (y < 0 || y >= h) return;
  for (let k = 0; k < text.length; k++) {
    const col = x + k;
    if (col >= 0 && col < w && text[k] !== " ") cells[y * w + col] = text[k];
  }
}

// donut.c, de Andy Sloane: o toro girando que inspirou tudo isto.
const donut: Scene["make"] = (w, h, cellRatio) => {
  const SHADES = ".,-~:;=!*#$@";
  const R1 = 1;
  const R2 = 2;
  const K2 = 5;
  // Cabe na altura e na largura (no celular a tela é estreita e alta).
  const sy = Math.min(h * 0.6, w * cellRatio * 0.55);
  const sx = sy / cellRatio;
  // Em telas grandes, amostra mais pontos para o toro não ficar com buracos.
  const thetaStep = Math.min(0.07, 3 / sy);
  const phiStep = Math.min(0.02, 1 / sx);
  let A = 1;
  let B = 1;

  return (_t, dt) => {
    A += dt * 1.2;
    B += dt * 0.6;
    const cells = blank(w, h);
    const zbuf = new Float32Array(w * h);
    const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);

    for (let theta = 0; theta < 6.28; theta += thetaStep) {
      const ct = Math.cos(theta), st = Math.sin(theta);
      for (let phi = 0; phi < 6.28; phi += phiStep) {
        const cp = Math.cos(phi), sp = Math.sin(phi);
        const cx = R2 + R1 * ct;
        const cy = R1 * st;
        const x = cx * (cB * cp + sA * sB * sp) - cy * cA * sB;
        const y = cx * (sB * cp - sA * cB * sp) + cy * cA * cB;
        const ooz = 1 / (K2 + cA * cx * sp + cy * sA);
        const xp = Math.round(w / 2 + sx * ooz * x);
        const yp = Math.round(h / 2 - sy * ooz * y);
        if (xp < 0 || xp >= w || yp < 0 || yp >= h) continue;
        const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp);
        const i = yp * w + xp;
        if (L > 0 && ooz > zbuf[i]) {
          zbuf[i] = ooz;
          cells[i] = SHADES[Math.min(SHADES.length - 1, Math.floor(L * 8))];
        }
      }
    }
    return cells;
  };
};

// Jogo da Vida de Conway, começando de uma "sopa" aleatória.
const life: Scene["make"] = (w, h) => {
  let alive = Uint8Array.from({ length: w * h }, () => (Math.random() < 0.3 ? 1 : 0));
  let age = new Uint16Array(w * h);
  let clock = 0;

  return (_t, dt) => {
    clock += dt;
    while (clock >= 0.09) {
      clock -= 0.09;
      const next = new Uint8Array(w * h);
      const nextAge = new Uint16Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx || dy) n += alive[((y + dy + h) % h) * w + ((x + dx + w) % w)];
            }
          }
          const i = y * w + x;
          if (n === 3 || (n === 2 && alive[i])) {
            next[i] = 1;
            nextAge[i] = alive[i] ? age[i] + 1 : 0;
          }
        }
      }
      alive = next;
      age = nextAge;
    }
    // Célula recém-nascida é "o"; as mais velhas ficam mais cheias.
    return Array.from(alive, (a, i) => (a ? (age[i] < 2 ? "o" : age[i] < 6 ? "O" : "@") : " "));
  };
};

// O trem do comando sl, que aparece quando você digita "ls" errado.
// Com -F, ele sai voando. Desenho do sl, de Toyoda Masashi.
const TRAIN = [
  "      ====        ________                ___________ ",
  "  _D _|  |_______/        \\__I_I_____===__|_________| ",
  "   |(_)---  |   H\\________/ |   |        =|___ ___|   ",
  "   /     |  |   H  |  |     |   |         ||_| |_||   ",
  "  |      |  |   H  |__--------------------| [___] |   ",
  "  | ________|___H__/__|_____/[][]~\\_______|       |   ",
  "  |/ |   |-----------I_____I [][] []  D   |=======|__ ",
  "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ",
  " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ",
];
const WHEELS = [
  "  \\_/      \\O=====O=====O=====O_/      \\_/            ",
  "  \\_/      \\_O=====O=====O=====O/      \\_/            ",
  "  \\_/      \\__O=====O=====O=====O      \\_/            ",
];

const sl: Scene["make"] = (w, h) => {
  const width = TRAIN[0].length;
  const height = TRAIN.length + 4; // trem + rodas + fumaça

  return (t) => {
    const cells = blank(w, h);
    // Cruza a tela na diagonal: entra embaixo à direita e sai voando em cima à esquerda.
    const p = t / 7;
    const x = Math.round(w - p * (w + width));
    const top = Math.round(h + 3 - p * (h + height));
    TRAIN.forEach((line, k) => write(cells, w, h, x, top + k, line));
    write(cells, w, h, x, top + TRAIN.length, WHEELS[Math.floor(t * 8) % WHEELS.length]);
    // Fumaça saindo da chaminé e ficando para trás.
    const puffs = ["(  )", "( )", "()", "o", "."];
    for (let k = 0; k < puffs.length; k++) {
      const drift = Math.floor((t * 6 + k * 2) % 10);
      write(cells, w, h, x + 6 + k * 4 + drift, top - 1 - Math.min(k, 2), puffs[k]);
    }
    return cells;
  };
};

// Pong em que os dois lados jogam sozinhos (e às vezes erram).
const pong: Scene["make"] = (w, h) => {
  const PADDLE = Math.max(3, Math.round(h / 5));
  // Velocidade proporcional à altura: em telas altas a bola anda mais linhas por segundo.
  const left = { y: h / 2, speed: h * 0.45 };
  const right = { y: h / 2, speed: h * 0.55 };
  const score = [0, 0];
  const serve = (dir: number) => ({
    x: w / 2,
    y: h / 2,
    vx: dir * w * 0.45,
    vy: (Math.random() - 0.5) * h * 1.4,
  });
  let ball = serve(1);

  return (_t, dt) => {
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.y < 1) {
      ball.y = 1;
      ball.vy *= -1;
    }
    if (ball.y > h - 1) {
      ball.y = h - 1;
      ball.vy *= -1;
    }

    for (const paddle of [left, right]) {
      const diff = ball.y - paddle.y;
      paddle.y += Math.sign(diff) * Math.min(Math.abs(diff), paddle.speed * dt);
    }

    const hits = (paddle: { y: number }) => Math.abs(ball.y - paddle.y) <= PADDLE / 2 + 0.5;
    if (ball.vx < 0 && ball.x <= 3) {
      if (hits(left)) ball.vx = Math.abs(ball.vx) * 1.05;
      else if (ball.x < 0) {
        score[1]++;
        ball = serve(1);
      }
    }
    if (ball.vx > 0 && ball.x >= w - 4) {
      if (hits(right)) ball.vx = -Math.abs(ball.vx) * 1.05;
      else if (ball.x > w) {
        score[0]++;
        ball = serve(-1);
      }
    }

    const cells = blank(w, h);
    for (let y = 1; y < h; y += 2) write(cells, w, h, Math.floor(w / 2), y, ":");
    write(cells, w, h, Math.floor(w / 2) - 4, 1, `${score[0]}`);
    write(cells, w, h, Math.floor(w / 2) + 4, 1, `${score[1]}`);
    for (let k = 0; k < PADDLE; k++) {
      write(cells, w, h, 2, Math.round(left.y - PADDLE / 2 + k), "#");
      write(cells, w, h, w - 3, Math.round(right.y - PADDLE / 2 + k), "#");
    }
    write(cells, w, h, Math.round(ball.x), Math.round(ball.y), "O");
    return cells;
  };
};

// cowsay, com uma frase que todo estudante de computação já ouviu.
const MOOS = [
  "funciona na minha máquina",
  "git push --force na sexta? corajoso.",
  "não é bug, é feature",
  "já tentou desligar e ligar de novo?",
  "Hello, World!",
];

const cowsay: Scene["make"] = (w, h) => {
  const moo = MOOS[Math.floor(Math.random() * MOOS.length)];
  const line = "-".repeat(moo.length + 2);

  return (t) => {
    const typed = moo.slice(0, Math.floor(t * 18));
    // A vaca pisca de vez em quando.
    const eyes = t % 3 > 2.85 ? "--" : "oo";
    const art = [
      ` ${"_".repeat(moo.length + 2)}`,
      `< ${typed.padEnd(moo.length)} >`,
      ` ${line}`,
      "        \\   ^__^",
      `         \\  (${eyes})\\_______`,
      "            (__)\\       )\\/\\",
      "                ||----w |",
      "                ||     ||",
    ];
    const width = Math.max(...art.map((row) => row.length));
    const x = Math.floor((w - width) / 2);
    const y = Math.max(2, Math.floor((h - art.length) / 2));
    const cells = blank(w, h);
    art.forEach((row, k) => write(cells, w, h, x, y + k, row));
    return cells;
  };
};

export const scenes: Scene[] = [
  { command: "./donut", make: donut },
  { command: "sl -F", make: sl },
  { command: "life", make: life },
  { command: "pong", make: pong },
  { command: "cowsay", make: cowsay },
];

/** Linha de comando digitada no canto da cena, como num terminal. */
export function withPrompt(
  frame: Frame,
  command: string,
  w: number,
  h: number,
  x = 0,
  y = 0,
): Frame {
  return (t, dt) => {
    const cells = frame(t, dt);
    const typed = `$ ${command.slice(0, Math.floor(t * 14))}`;
    const cursor = Math.floor(t * 2) % 2 === 0 ? "_" : "";
    write(cells, w, h, x, y, typed + cursor);
    return cells;
  };
}
