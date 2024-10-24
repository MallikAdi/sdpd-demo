// JavaScript implementation
function fibonacciJS(n) {
  if (n <= 1) return n;

  let prev = 0n;
  let current = 1n;

  for (let i = 2; i <= n; i++) {
    const next = prev + current;
    prev = current;
    current = next;
  }

  return current;
}

// WebAssembly loading
let wasmInstance = null;

WebAssembly.instantiateStreaming(fetch("fibonacci.wasm")).then((obj) => {
  wasmInstance = obj.instance;
});

function formatExecutionTime(time) {
  if (time < 0.001) {
    return `${(time * 1_000_000).toFixed(3)} ns`;
  } else if (time < 1) {
    return `${(time * 1_000).toFixed(3)} μs`;
  }
  return `${time.toFixed(6)} ms`;
}

function calculateStats(times) {
  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  const variance =
    times.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);

  return { avg, min, max, stdDev };
}

async function benchmark(type, input, iterations) {
  document.getElementById(`${type}Progress`).style.display = "block";
  const progressBar = document.getElementById(`${type}ProgressBar`);

  const times = [];
  let result;

  // Warm-up run
  if (type === "wasm") {
    wasmInstance.exports.fibonacci(input);
  } else {
    fibonacciJS(input);
  }

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();

    if (type === "wasm") {
      result = wasmInstance.exports.fibonacci(input);
    } else {
      result = fibonacciJS(input);
    }

    const end = performance.now();
    times.push(end - start);

    if (i % 10 === 0) {
      progressBar.style.width = `${(i / iterations) * 100}%`;
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  progressBar.style.width = "100%";
  setTimeout(() => {
    document.getElementById(`${type}Progress`).style.display = "none";
    progressBar.style.width = "0%";
  }, 500);

  const stats = calculateStats(times);
  return { result, stats };
}

async function runComparison() {
  const input = parseInt(document.getElementById("number").value);
  const iterations = parseInt(document.getElementById("iterationCount").value);

  if (input > 78) {
    alert("Please enter a number <= 78 to avoid overflow");
    return;
  }

  const compareButton = document.getElementById("compareButton");
  compareButton.disabled = true;
  compareButton.textContent = "Running Benchmark...";

  // Reset results
  document.getElementById("wasmResult").innerHTML =
    "Running WebAssembly benchmark...";
  document.getElementById("jsResult").innerHTML = "Waiting...";

  // Run WebAssembly benchmark
  const wasmResults = await benchmark("wasm", input, iterations);

  document.getElementById("wasmResult").innerHTML = `
      <div>Result: ${wasmResults.result}</div>
      <div class="stats">
        <div>Average: <span class="timing">${formatExecutionTime(
          wasmResults.stats.avg
        )}</span></div>
        <div>Min: <span class="timing">${formatExecutionTime(
          wasmResults.stats.min
        )}</span></div>
        <div>Max: <span class="timing">${formatExecutionTime(
          wasmResults.stats.max
        )}</span></div>
        <div>Std Dev: <span class="timing">${formatExecutionTime(
          wasmResults.stats.stdDev
        )}</span></div>
      </div>
    `;

  document.getElementById("jsResult").innerHTML =
    "Running JavaScript benchmark...";

  // Run JavaScript benchmark
  const jsResults = await benchmark("js", input, iterations);

  document.getElementById("jsResult").innerHTML = `
      <div>Result: ${jsResults.result}</div>
      <div class="stats">
        <div>Average: <span class="timing">${formatExecutionTime(
          jsResults.stats.avg
        )}</span></div>
        <div>Min: <span class="timing">${formatExecutionTime(
          jsResults.stats.min
        )}</span></div>
        <div>Max: <span class="timing">${formatExecutionTime(
          jsResults.stats.max
        )}</span></div>
        <div>Std Dev: <span class="timing">${formatExecutionTime(
          jsResults.stats.stdDev
        )}</span></div>
      </div>
    `;

  // Calculate and display speedup
  const speedup = jsResults.stats.avg / wasmResults.stats.avg;
  const comparisonText = `<div class="stats">
      <strong>WebAssembly is ${speedup.toFixed(
        2
      )}x faster than JavaScript</strong>
    </div>`;

  document
    .getElementById("wasmResult")
    .insertAdjacentHTML(
      "beforeend",
      `<div class="faster">${comparisonText}</div>`
    );
  document
    .getElementById("jsResult")
    .insertAdjacentHTML(
      "beforeend",
      `<div class="slower">${comparisonText}</div>`
    );

  compareButton.disabled = false;
  compareButton.textContent = "Run Comparison";
}
