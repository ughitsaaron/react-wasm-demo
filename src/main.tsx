import * as React from 'react';
import { render } from 'react-dom';

declare const WebAssembly: any;

const rust = require('rustify');
const wasm = rust('./main.rs');

interface IApplicationState {
  js: boolean;
  wasm: boolean;
}

(async function () {
  // await the response from the wasm loader
  const doLoop = await instantiateWasm();

  class Application extends React.PureComponent<{}, IApplicationState> {
    constructor(props) {
      super(props);

      this.jsLoop = this.jsLoop.bind(this);
      this.rsLoop = this.rsLoop.bind(this);

      this.state = { js: false, wasm: false };
    }

    jsLoop = (e: React.MouseEvent<HTMLButtonElement>, n: boolean): void => {
      this.setState({ js: jsLoop() });
    }

    rsLoop = (): void => {
      this.setState({ wasm: doLoop() });
    }

    reset = (): void => {
      this.setState({ js: false, wasm: false });
    }

    render() {
      const { js, wasm } = this.state;

      return (<div>
        <button onClick={e => this.jsLoop(e, js)} disabled={js}>Count to 1 billion in JavaScript {js ? '(Finished)' : ''}</button>
        <p>
        <button onClick={_ => this.rsLoop()} disabled={wasm}>Count to 1 billion in WebAssembly {wasm ? '(Finished)' : ''}</button>
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
  }

  return true;
}

function instantiateWasm() {
  return WebAssembly.instantiate(wasm, {})
    .then(res => res.instance.exports.doLoop)
    .catch(e => console.error('WASM failed', e));
}
