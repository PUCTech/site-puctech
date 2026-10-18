// Cenas ASCII que aparecem no topo da home, entre uma exibição e outra do "PUCTech".
//
// Cada cena é uma função (largura, altura, proporção da célula) que devolve
// outra função: a cada quadro ela recebe o tempo da cena (s) e o intervalo (s)
// e devolve a grade inteira (largura × altura), com " " nas células vazias.

/**
 * Grade de um quadro. `style` (opcional) muda o visual de cada célula. Os tons
 * de opacidade dão profundidade: 0 = cheio (100%), SOFT (65%), DIM (35%), FAINT (15%).
 * INVERSE = invertida (fundo ciano, como as barras do htop).
 */
export type Grid = string[] & { style?: Uint8Array };
export const DIM = 1;
export const INVERSE = 2;
export const SOFT = 3;
export const FAINT = 4;

export type Frame = (t: number, dt: number) => Grid;
export type Scene = { command: string; make: (w: number, h: number, cellRatio: number) => Frame };

const blank = (w: number, h: number): Grid => new Array<string>(w * h).fill(" ");

/** Marca o tom de uma célula (cria o mapa de estilos na primeira vez). */
function tint(cells: Grid, i: number, tone: number) {
  cells.style ??= new Uint8Array(cells.length);
  cells.style[i] = tone;
}

/** Escreve um texto na grade, cortando o que sair dela, opcionalmente num tom. */
function write(cells: Grid, w: number, h: number, x: number, y: number, text: string, tone = 0) {
  if (y < 0 || y >= h) return;
  for (let k = 0; k < text.length; k++) {
    const col = x + k;
    if (col < 0 || col >= w) continue;
    const i = y * w + col;
    if (text[k] !== " ") cells[i] = text[k];
    // O invertido pinta também os espaços (o fundo ciano é contínuo).
    if (tone && (text[k] !== " " || tone === INVERSE)) tint(cells, i, tone);
  }
}

// donut.c, de Andy Sloane: o toro girando que inspirou tudo isto.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- fora do rodízio (veja scenes), guardado para voltar
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
          // A parte menos iluminada também fica mais transparente: dá volume.
          const tone = L < 0.25 ? FAINT : L < 0.5 ? DIM : L < 0.75 ? SOFT : 0;
          if (tone) tint(cells, i, tone);
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
    // Célula recém-nascida é "o" e quase transparente; as mais velhas ficam cheias.
    const cells: Grid = Array.from(alive, (a, i) => (a ? (age[i] < 2 ? "o" : age[i] < 6 ? "O" : "@") : " "));
    alive.forEach((a, i) => {
      if (a && age[i] < 6) tint(cells, i, age[i] < 2 ? DIM : SOFT);
    });
    return cells;
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
    const tones = [SOFT, SOFT, DIM, FAINT, FAINT]; // some aos poucos
    for (let k = 0; k < puffs.length; k++) {
      const drift = Math.floor((t * 6 + k * 2) % 10);
      write(cells, w, h, x + 6 + k * 4 + drift, top - 1 - Math.min(k, 2), puffs[k], tones[k]);
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
    for (let y = 1; y < h; y += 2) write(cells, w, h, Math.floor(w / 2), y, ":", FAINT);
    write(cells, w, h, Math.floor(w / 2) - 4, 1, `${score[0]}`, SOFT);
    write(cells, w, h, Math.floor(w / 2) + 4, 1, `${score[1]}`, SOFT);
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
    art.forEach((row, k) => write(cells, w, h, x, y + k, row, k === 0 || k === 2 ? DIM : k === 1 ? 0 : SOFT));
    // As bordas "<" e ">" do balão também ficam atrás.
    write(cells, w, h, x, y + 1, "<", DIM);
    write(cells, w, h, x + moo.length + 3, y + 1, ">", DIM);
    return cells;
  };
};

// htop, réplica 1:1 do layout padrão do htop 3: CPUs e memória em duas colunas,
// tabela de processos ordenada por CPU% e a barra de teclas F1–F10 embaixo.
// Atualiza a cada 1,5 s, como o htop por padrão.
type Proc = {
  pid: number;
  user: string;
  cmd: string;
  cpu: number; // CPU% atual
  base: number; // CPU% em torno do qual oscila
  mem: number;
  virt: string;
  res: string;
  shr: string;
  time: number; // segundos de CPU acumulados
};

const PROCESSES: [string, string, number, number, string, string, string][] = [
  // usuário, comando, CPU% médio, MEM%, VIRT, RES, SHR
  ["puctech", "/usr/bin/python3 train_model.py --epochs 300", 92, 9.8, "8124M", "1.5G", "212M"],
  ["puctech", "/opt/unity/Editor/Unity -projectPath ~/rothernet", 48, 12.1, "11.2G", "1.9G", "301M"],
  ["puctech", "/usr/bin/node .next/standalone/server.js", 31, 3.2, "4012M", "512M", "102M"],
  ["puctech", "/opt/google/chrome/chrome --type=renderer (47 abas)", 26, 7.4, "1.3T", "1.1G", "187M"],
  ["puctech", "/usr/share/code/code --type=renderer", 18, 4.6, "1.2T", "731M", "142M"],
  ["postgres", "postgres: careon careon_db 127.0.0.1(5432) idle", 11, 1.4, "421M", "221M", "198M"],
  ["puctech", "/usr/lib/jvm/java-21/bin/java -jar minerva-api.jar", 9, 6.2, "6301M", "981M", "38M"],
  ["root", "/usr/bin/dockerd -H fd:// --containerd=/run/containerd.sock", 6, 0.8, "2683M", "124M", "61M"],
  ["puctech", "/usr/bin/uvicorn rothernet.api:app --port 8000", 5, 1.1, "612M", "178M", "41M"],
  ["puctech", "/usr/bin/spotify --type=utility lofi-beats-to-code-to", 4, 1.9, "1.1T", "297M", "112M"],
  ["root", "/usr/lib/Xorg :0 -seat seat0 -auth /run/lightdm/root", 3, 0.6, "742M", "98M", "61M"],
  ["puctech", "/usr/bin/zsh", 2, 0.1, "17964", "9812", "6412"],
  ["puctech", "./donut", 2, 0.0, "2388", "1024", "880"],
  ["root", "/usr/bin/containerd", 1.5, 0.4, "1946M", "58M", "31M"],
  ["puctech", "/usr/bin/python3 -m jupyter lab", 1.2, 1.7, "912M", "271M", "33M"],
  ["root", "/lib/systemd/systemd-journald", 1, 0.2, "92740", "31204", "29812"],
  ["postgres", "postgres: checkpointer", 0.8, 0.3, "421M", "41M", "39M"],
  ["puctech", "/usr/bin/git fetch --all", 0.7, 0.1, "29112", "11240", "8124"],
  ["root", "/usr/sbin/sshd -D", 0.4, 0.1, "15420", "9124", "7812"],
  ["root", "/sbin/init splash", 0.3, 0.1, "167M", "13212", "8412"],
  ["puctech", "/usr/bin/tmux new -s liga", 0.3, 0.1, "13004", "5212", "3904"],
  ["postgres", "postgres: walwriter", 0.3, 0.1, "421M", "11M", "9412"],
  ["root", "/usr/lib/snapd/snapd", 0.2, 0.3, "1789M", "41M", "21M"],
  ["www-data", "nginx: worker process", 0.2, 0.1, "55912", "7104", "4412"],
  ["root", "nginx: master process /usr/sbin/nginx", 0.1, 0.0, "55212", "1880", "112"],
  ["puctech", "/usr/bin/vim README.md", 0.1, 0.1, "24412", "11024", "6912"],
  ["root", "/usr/sbin/cron -f", 0.0, 0.0, "6812", "2704", "2412"],
  ["puctech", "/usr/bin/htop", 0.6, 0.0, "10212", "4812", "3412"],
  ["root", "/usr/sbin/NetworkManager --no-daemon", 0.1, 0.1, "335M", "18M", "15M"],
  ["root", "/usr/lib/bluetooth/bluetoothd", 0.0, 0.0, "11204", "6012", "5112"],
  ["puctech", "/usr/bin/pipewire", 0.4, 0.1, "102M", "14M", "8412"],
  ["puctech", "/usr/bin/redis-server 127.0.0.1:6379", 0.2, 0.1, "71204", "9812", "4412"],
  ["root", "/usr/sbin/cupsd -l", 0.0, 0.0, "21412", "11204", "9912"],
  ["puctech", "/usr/bin/ssh-agent -s", 0.0, 0.0, "8112", "4012", "3812"],
  ["root", "/usr/lib/polkit-1/polkitd --no-debug", 0.0, 0.1, "310M", "8412", "6912"],
  ["puctech", "/usr/libexec/gvfsd", 0.0, 0.0, "240M", "7412", "6512"],
];

const htop: Scene["make"] = (w, h) => {
  const procs: Proc[] = PROCESSES.map(([user, cmd, base, mem, virt, res, shr], i) => ({
    pid: 1000 + ((i * 7919) % 30000),
    user,
    cmd,
    base,
    cpu: base,
    mem,
    virt,
    res,
    shr,
    time: base * 37 + i * 13,
  }));
  const cpus = Array.from({ length: 8 }, () => 0.2 + Math.random() * 0.5);
  let load = [2.14, 1.98, 1.77];
  let clock = 1.5; // já começa atualizando
  let cursor = 0;
  let cursorClock = 0;

  const fmtTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    return `${m}:${(sec % 60).toFixed(2).padStart(5, "0")}`;
  };
  const row = (f: string[]) =>
    `${f[0].padStart(7)} ${f[1].padEnd(9)} ${f[2].padStart(3)} ${f[3].padStart(3)} ${f[4].padStart(5)} ${f[5].padStart(5)} ${f[6].padStart(5)} ${f[7]} ${f[8].padStart(5)} ${f[9].padStart(4)} ${f[10].padStart(9)}  `;
  const HEADER = row(["PID", "USER", "PRI", "NI", "VIRT", "RES", "SHR", "S", "CPU%", "MEM%", "TIME+"]) + "Command";

  return (t, dt) => {
    // A cada 1,5 s os números mudam, como o htop.
    clock += dt;
    if (clock >= 1.5) {
      clock = 0;
      for (const p of procs) p.cpu = Math.max(0, p.base * (0.55 + Math.random() * 0.9));
      cpus.forEach((c, i) => (cpus[i] = Math.min(0.98, Math.max(0.03, c + (Math.random() - 0.5) * 0.35))));
      load = load.map((l) => Math.max(0.4, l + (Math.random() - 0.5) * 0.3));
    }
    for (const p of procs) p.time += (p.cpu / 100) * dt;
    // O cursor desce de vez em quando, como alguém navegando com as setas.
    cursorClock += dt;
    if (cursorClock > 1.1) {
      cursorClock = 0;
      cursor++;
    }

    const cells = blank(w, h);
    const x0 = 1;
    const W = w - 2;
    const put = (x: number, y: number, text: string, tone = 0) => write(cells, w, h, x, y, text, tone);

    // Medidor: "  0[||||||||        34.2%]", com o valor por cima da barra, no fim.
    const meter = (x: number, y: number, width: number, label: string, frac: number, text: string) => {
      const inner = width - 5;
      const fill = Math.round(Math.min(1, frac) * inner);
      put(x, y, label.padStart(3));
      put(x + 3, y, "[");
      put(x + 4, y, "|".repeat(Math.min(fill, inner - text.length)));
      put(x + 4 + inner - text.length, y, text, 1);
      put(x + 4 + inner, y, "]");
    };

    const top = 3;
    const colW = Math.floor((W - 2) / 2);
    const right = x0 + colW + 2;
    for (let i = 0; i < 4; i++) {
      meter(x0, top + i, colW, `${i}`, cpus[i], `${(cpus[i] * 100).toFixed(1)}%`);
      meter(right, top + i, colW, `${i + 4}`, cpus[i + 4], `${(cpus[i + 4] * 100).toFixed(1)}%`);
    }
    const memUsed = 5.21 + Math.sin(t / 3) * 0.08;
    meter(x0, top + 4, colW, "Mem", memUsed / 15.5, `${memUsed.toFixed(2)}G/15.5G`);
    meter(x0, top + 5, colW, "Swp", 0.055, "112M/2.00G");

    const running = procs.filter((p) => p.cpu > 8).length;
    const label = (y: number, name: string, value: string) => {
      put(right + 2, y, name, 1);
      put(right + 2 + name.length, y, value);
    };
    label(top + 4, "Tasks: ", `${procs.length + 177}, 1047 thr, 312 kthr; ${running} running`);
    label(top + 5, "Load average: ", load.map((l) => l.toFixed(2)).join(" "));
    const up = 21 * 86400 + 3 * 3600 + 41 * 60 + 12 + Math.floor(t);
    const hh = String(Math.floor((up % 86400) / 3600)).padStart(2, "0");
    const mm = String(Math.floor((up % 3600) / 60)).padStart(2, "0");
    const ss = String(up % 60).padStart(2, "0");
    label(top + 6, "Uptime: ", `${Math.floor(up / 86400)} days, ${hh}:${mm}:${ss}`);

    // Tabela de processos, até ~70% da altura (abaixo disso a abertura esmaece).
    const bottom = Math.max(top + 12, Math.floor(h * 0.72));
    const headerY = top + 8;
    put(x0, headerY, HEADER.padEnd(W).slice(0, W), INVERSE);
    const visible = bottom - headerY - 1;
    const sorted = [...procs].sort((a, b) => b.cpu - a.cpu);
    const selected = cursor % Math.max(1, Math.min(visible, sorted.length));
    sorted.slice(0, visible).forEach((p, k) => {
      const y = headerY + 1 + k;
      const fields = [
        String(p.pid),
        p.user,
        "20",
        "0",
        p.virt,
        p.res,
        p.shr,
        p.cpu > 8 ? "R" : "S",
        p.cpu.toFixed(1),
        p.mem.toFixed(1),
        fmtTime(p.time),
      ];
      const line = (row(fields) + p.cmd).padEnd(W).slice(0, W);
      if (k === selected) {
        put(x0, y, line, INVERSE);
        return;
      }
      // Processos quase parados ficam um pouco atrás, para a lista ter profundidade.
      put(x0, y, line, p.cpu < 0.5 ? SOFT : 0);
      // Como no htop: o caminho do programa fica apagado e o nome dele em destaque.
      const at = row(fields).length;
      const path = p.cmd.split(" ")[0];
      const slash = path.lastIndexOf("/");
      if (slash > 0) put(x0 + at, y, path.slice(0, slash + 1).slice(0, Math.max(0, W - at)), DIM);
    });

    // Barra de teclas: "F1" normal e o nome invertido, até o fim da linha.
    const keys = ["Help", "Setup", "Search", "Filter", "Tree", "SortBy", "Nice -", "Nice +", "Kill", "Quit"];
    let x = x0;
    keys.forEach((name, i) => {
      const key = `F${i + 1}`;
      put(x, bottom, key);
      x += key.length;
      const text = name.padEnd(6);
      put(x, bottom, text, INVERSE);
      x += text.length;
    });
    if (x < x0 + W) put(x, bottom, " ".repeat(x0 + W - x), INVERSE);
    return cells;
  };
};

// neofetch: o cartão de "sistema" da liga.
const neofetch: Scene["make"] = (w, h) => {
  const art = [
    "   ____  _   _  ____ ",
    "  |  _ \\| | | |/ ___|",
    "  | |_) | | | | |    ",
    "  |  __/| |_| | |___ ",
    "  |_|    \\___/ \\____|",
    "      _____         _     ",
    "     |_   _|__  ___| |__  ",
    "       | |/ _ \\/ __| '_ \\ ",
    "       | |  __/ (__| | | |",
    "       |_|\\___|\\___|_| |_|",
  ];
  const info = [
    "puctech@puc-sp",
    "--------------",
    "OS: PUC Tech Linux 2024.1",
    "Host: PUC-SP, São Paulo",
    "Kernel: protagonismo-estudantil",
    "Uptime: desde 2024",
    "Packages: 10+ projetos",
    "Shell: zsh (com muito café)",
    "Members: 50+ estudantes",
    "CPU: Ciência da Computação",
    "GPU: ideias em paralelo",
  ];
  return (t) => {
    const cells = blank(w, h);
    const width = 32 + 34;
    const x = Math.floor((w - width) / 2);
    const y = Math.max(3, Math.floor((h - info.length) / 2));
    art.forEach((row, k) => write(cells, w, h, x, y + k, row));
    // As linhas de informação aparecem uma a uma.
    info.slice(0, Math.floor(t * 6)).forEach((row, k) => {
      const colon = row.indexOf(": ");
      if (colon < 0) return write(cells, w, h, x + 32, y + k, row, row.startsWith("-") ? DIM : 0);
      write(cells, w, h, x + 32, y + k, row.slice(0, colon + 1));
      write(cells, w, h, x + 34 + colon, y + k, row.slice(colon + 2), SOFT);
    });
    return cells;
  };
};

// Mensagens de commit usadas no painel de git log do tmux.
const COMMITS = [
  "feat: hero em ASCII",
  "fix: o donut girava ao contrário",
  "Merge branch 'main' into feat/redesign",
  "chore: remove console.log (de novo)",
  "feat: modo escuro",
  "fix: funciona na minha máquina",
  "docs: README que ninguém vai ler",
  "refactor: renomeia variável x para x2",
  "feat: pong que às vezes erra",
  "revert: 'fix: funciona na minha máquina'",
  "style: mais um tom de ciano",
  "test: adiciona o primeiro teste (finalmente)",
  "feat: processo seletivo 2027",
  "fix: typo",
  "fix: typo do fix anterior",
];

// tmux com três painéis, como um dia normal de desenvolvimento: Claude Code em
// cima, git log embaixo e o `npm run dev` rodando à direita.
const CLAUDE: [string, number][] = [
  // texto, tom
  ["> deixa o ASCII da abertura azul-escuro no modo claro", 0],
  ["", 0],
  ["● Update(components/AsciiLogo.tsx)", SOFT],
  ["  └ Updated components/AsciiLogo.tsx with 1 addition and 1 removal", DIM],
  ["    372 -  leading-none text-accent sm:text-[9px]", DIM],
  ["    372 +  leading-none text-ink sm:text-[9px] dark:text-accent", 0],
  ["", 0],
  ["● Bash(npm run build)", SOFT],
  ["  └ ✓ Compiled successfully", DIM],
  ["", 0],
  ["● No modo claro o ASCII agora é azul-escuro #04142f;", 0],
  ["  no escuro continua ciano. Commit 3d04219.", 0],
  ["", 0],
  ["* Brewed for 24s", FAINT],
];

const ROUTES = ["/", "/", "/", "/sobre", "/membros", "/projetos", "/processo-seletivo"];
const devLine = (): [string, number][] => {
  if (Math.random() < 0.18) return [[" ✓ Compiled in " + (12 + ((Math.random() * 25) | 0)) + "ms", SOFT]];
  const total = 14 + ((Math.random() * 60) | 0);
  const next = (0.9 + Math.random() * 5).toFixed(1);
  const route = ROUTES[(Math.random() * ROUTES.length) | 0];
  return [
    [` GET ${route} `, 0],
    ["200", SOFT],
    [` in ${total}ms `, 0],
    [`(next.js: ${next}ms, application-code: ${total - 2}ms)`, DIM],
  ];
};

const tmux: Scene["make"] = (w, h) => {
  const x0 = 1;
  const W = w - 2;
  const top = 3;
  const bottom = Math.max(top + 14, Math.floor(h * 0.72)); // barra de status
  const split = x0 + Math.floor(W * 0.55); // divisória vertical
  const mid = top + Math.floor((bottom - top) * 0.55); // divisória do lado esquerdo
  const graph = COMMITS.flatMap((msg, i) => {
    const hash = Math.random().toString(16).slice(2, 9);
    return i % 4 === 2 ? [["|\\", ""], [`| * ${hash}`, msg], ["|/", ""]] : [[`* ${hash}`, msg]];
  });
  // Log do servidor: começa com o cabeçalho do next dev e vai ganhando linhas.
  const dev: [string, number][][] = [
    [["> site-puctech@0.1.0 dev", DIM]],
    [["> next dev", DIM]],
    [["", 0]],
    [["   ▲ Next.js 16.3.8", 0]],
    [["   - Local:        http://localhost:3000", SOFT]],
    [[" ✓ Ready in 812ms", SOFT]],
  ];
  let devClock = 0;

  return (t, dt) => {
    const cells = blank(w, h);
    // Escreve dentro de um painel, cortando o que passar da largura.
    const put = (x: number, y: number, width: number, text: string, tone = 0) =>
      write(cells, w, h, x, y, text.slice(0, Math.max(0, width)), tone);

    // Bordas dos painéis.
    for (let y = top; y < bottom; y++) put(split, y, 1, "│", DIM);
    put(x0, mid, split - x0, "─".repeat(split - x0), DIM);
    put(split, mid, 1, "┤", DIM);

    // Claude Code (em cima, à esquerda): o pedido é digitado e as respostas vêm em seguida.
    const leftW = split - x0 - 2;
    const prompt = CLAUDE[0][0];
    const typed = Math.min(prompt.length, Math.floor(t * 30));
    put(x0 + 1, top, leftW, prompt.slice(0, typed));
    const shownLines = typed < prompt.length ? 0 : Math.floor((t - prompt.length / 30) * 4);
    CLAUDE.slice(1, 1 + shownLines).forEach(([text, tone], k) => {
      if (top + 1 + k < mid) put(x0 + 1, top + 1 + k, leftW, text, tone);
    });

    // git log (embaixo, à esquerda).
    const shell = "~/dev/site-puctech on feat/redesign > ";
    const cmd = "git log --oneline --graph";
    put(x0 + 1, mid + 1, leftW, shell, DIM);
    put(x0 + 1 + shell.length, mid + 1, leftW - shell.length, cmd.slice(0, Math.floor(t * 18)));
    if (t * 18 > cmd.length + 6) {
      graph.slice(0, bottom - mid - 2).forEach(([g, msg], k) => {
        const y = mid + 2 + k;
        put(x0 + 1, y, leftW, g, DIM);
        put(x0 + 1 + g.length + 1, y, leftW - g.length - 1, msg);
      });
    }

    // npm run dev (à direita): uma linha nova a cada ~0,25 s, rolando para cima.
    devClock += dt;
    while (devClock > 0.25) {
      devClock -= 0.25;
      dev.push(devLine());
    }
    const rightX = split + 2;
    const rightW = x0 + W - rightX;
    const rows = bottom - top;
    dev.slice(-rows).forEach((parts, k) => {
      let x = rightX;
      for (const [text, tone] of parts) {
        put(x, top + k, rightX + rightW - x, text, tone);
        x += text.length;
      }
    });

    // Barra de status do tmux.
    const left = "[liga] 0:claude* 1:dev 2:git-";
    const now = new Date();
    const clock = `"puctech" ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const bar = (left + " ".repeat(Math.max(1, W - left.length - clock.length)) + clock).slice(0, W);
    put(x0, bottom, W, bar, INVERSE);
    return cells;
  };
};

// npm install: barra de progresso e a piada do node_modules.
const npm: Scene["make"] = (w, h) => {
  const steps = [
    "npm WARN deprecated left-pad@1.3.0: use String.prototype.padStart",
    "npm WARN deprecated request@2.88.2: request has been deprecated",
    "npm WARN peer react@19 required by algum-pacote@0.0.1",
  ];
  return (t) => {
    const cells = blank(w, h);
    const width = Math.min(w - 4, 70);
    const x = Math.floor((w - width) / 2);
    const y = Math.max(3, Math.floor(h / 2) - 4);
    steps.slice(0, Math.floor(t * 1.5)).forEach((row, k) => write(cells, w, h, x, y + k, row.slice(0, width), DIM));
    const p = Math.min(1, t / 5.5);
    const size = width - 10;
    const done = Math.round(p * size);
    write(cells, w, h, x, y + 4, `[${"#".repeat(done)}`);
    write(cells, w, h, x + 1 + done, y + 4, ".".repeat(size - done), FAINT);
    write(cells, w, h, x + 1 + size, y + 4, `] ${Math.round(p * 100)}%`);
    if (p >= 1) {
      write(cells, w, h, x, y + 6, "added 1337 packages in 6s");
      write(cells, w, h, x, y + 7, "node_modules: 2.4 GB (maior que o universo observável)", SOFT);
    }
    return cells;
  };
};

export const scenes: Scene[] = [
  // { command: "./donut", make: donut }, // fora do rodízio por enquanto
  { command: "sl -F", make: sl },
  { command: "life", make: life },
  { command: "pong", make: pong },
  { command: "cowsay", make: cowsay },
  { command: "htop", make: htop },
  { command: "neofetch", make: neofetch },
  { command: "tmux attach -t liga", make: tmux },
  { command: "npm install", make: npm },
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
    const typed = command.slice(0, Math.floor(t * 14));
    const cursor = Math.floor(t * 2) % 2 === 0 ? "_" : "";
    write(cells, w, h, x, y, "$", DIM);
    write(cells, w, h, x + 2, y, typed + cursor);
    return cells;
  };
}
