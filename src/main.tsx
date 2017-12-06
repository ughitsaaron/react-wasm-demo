import * as React from 'react';
import { render } from 'react-dom';

declare const WebAssembly: any;

const rust = require('rustify');
const wasm = rust('./do_loop.rs');

interface IApplicationState {
  js: boolean;
  wasm: boolean;
  jsms: number;
  wasmms: number;
}

(async function () {
  // await the response from the wasm loader
  const doLoop = await instantiateWasm();

  class Application extends React.PureComponent<{}, IApplicationState> {
    constructor(props) {
      super(props);

      this.jsLoop = this.jsLoop.bind(this);
      this.rsLoop = this.rsLoop.bind(this);

      this.state = {
        js: false,
        jsms: 0,
        wasm: false,
        wasmms: 0
      };
    }

    jsLoop = (e: React.MouseEvent<HTMLButtonElement>, n: boolean): void => {
      const start = Date.now();

      var end: number;

      this.setState({ js: !!jsLoop() }, function () {
        end = Date.now();

        this.setState({ jsms: end - start });
      }.bind(this));
    }

    rsLoop = (): void => {
      const start = Date.now();

      var end: number;

      this.setState({ wasm: !!doLoop() }, function () {
        end = Date.now();

        this.setState({ wasmms: end - start });
      }.bind(this));
    }

    reset = (): void => {
      this.setState({ js: false, wasm: false });
    }

    render() {
      const { js, wasm, jsms, wasmms } = this.state;

      return (<div>
        <button onClick={e => this.jsLoop(e, js)} disabled={js}>Count to 1 billion in JavaScript {js ? `(Finished in ${jsms}ms)` : ''}</button>
        <p>
        <button onClick={_ => this.rsLoop()} disabled={wasm}>Count to 1 billion in WebAssembly {wasm ? `(Finished in ${wasmms}ms)` : ''}</button>
        </p>
        <p>
          <button onClick={_ => this.reset()}>Reset the Demo</button>
        </p>
      </div>);
    }
  }

  render(<Application />, document.getElementById('app'));
})();

function jsLoop() {
  const max = 1000000000; // huge number

  var i = 0;

  while (i < max) {
    i += 1;

    if (i >= max) {
      return i;
    }
  }
}

function instantiateWasm() {
  return WebAssembly.instantiate(wasm, {})
    .then(res => res.instance.exports.do_loop)
    .catch(e => console.error('WASM failed', e));
}
