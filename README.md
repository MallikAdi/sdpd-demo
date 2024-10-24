# WebAssembly vs JavaScript Fibonacci Performance Comparison

This project demonstrates the performance advantages of WebAssembly (Wasm) over JavaScript when performing computationally intensive tasks, using the Fibonacci sequence calculation as an example.

## Overview

The application provides a side-by-side comparison of calculating Fibonacci numbers using both WebAssembly (compiled from C) and pure JavaScript implementations. This comparison helps illustrate how WebAssembly can significantly outperform JavaScript for CPU-intensive calculations.

## Prerequisites

- Emscripten SDK (for compiling C to WebAssembly)
- A local web server to serve the files
- A modern web browser with WebAssembly support

## Installation

### For Unix/Linux/MacOS (Bash):

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

### For Windows (CMD):

```cmd
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
emsdk.bat install latest
emsdk.bat activate latest
emsdk_env.bat
```

### Compile the C code to WebAssembly:

#### For Unix/Linux/MacOS (Bash):

```bash
emcc fibonacci.c -o fibonacci.wasm -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_fibonacci"]' -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' --no-entry
```

#### For Windows (CMD):

```cmd
emcc fibonacci.c -o fibonacci.wasm -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="['_fibonacci']" -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" --no-entry
```

## Running the Demo

1. Start a local web server in the project directory. Here are a few options:

   ### Using Python

   #### For Unix/Linux/MacOS (Bash):

   ```bash
   python3 -m http.server 8000
   ```

   #### For Windows (CMD):

   ```cmd
   python -m http.server 8000
   ```

   ### Using Node.js (requires `http-server` package)

   #### For both Bash and CMD:

   ```bash
   npx http-server
   ```

2. Open your browser and navigate to:
   - If using Python: `http://localhost:8000`
   - If using http-server: `http://localhost:8080`

## Project Structure

- `fibonacci.c` - C implementation of Fibonacci sequence
- `fibonacci.wasm` - Compiled WebAssembly binary
- `index.html` - Main HTML file containing the JavaScript implementation and UI

## Performance Comparison

The demo calculates Fibonacci numbers using both implementations and displays:

- Execution time for each implementation
- Performance comparison between WebAssembly and JavaScript
- Visual indication of which method performed better

## Why WebAssembly?

WebAssembly offers several advantages for computationally intensive tasks:

- Near-native execution speed
- Consistent performance across different browsers
- Ability to leverage existing C/C++ code
- Reduced JavaScript parsing and compilation overhead

## Troubleshooting

### Common Windows Issues:

1. If you receive a "command not found" error for `emcc`:
   - Make sure you've run `emsdk_env.bat`
   - Try reopening your CMD window after installation
2. If WebAssembly fails to load:
   - Ensure you're using a web server and not opening the file directly
   - Check that all files are in the same directory
   - Verify that your browser supports WebAssembly
