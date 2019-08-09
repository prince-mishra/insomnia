// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import YAML from 'yaml';
import type { ApiSpec } from '../../../models/api-spec';

type Props = {|
  apiSpec: ApiSpec,
|};

type State = {|
  parsedSpec: Object | null,
|};

@autobind
class SpecEditorSidebar extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      parsedSpec: null,
    };
  }

  _refreshSpec(apiSpec: ApiSpec) {
    let spec;
    try {
      spec = apiSpec.type === 'json' ? JSON.parse(apiSpec.contents) : YAML.parse(apiSpec.contents);
    } catch (err) {
      console.log('[spec-sidebar] Failed to parse', err);
      return;
    }

    this.setState({ parsedSpec: spec });
  }

  componentWillReceiveProps(nextProps: Props) {
    this._refreshSpec(nextProps.apiSpec);
  }

  componentDidMount() {
    this._refreshSpec(this.props.apiSpec);
  }

  render() {
    const { parsedSpec } = this.state;

    if (!parsedSpec) {
      // Not loaded yet
      return 'Loading...';
    }

    let title = (
      <React.Fragment>
        Missing <code>info.title</code>
      </React.Fragment>
    );
    if (parsedSpec.info && parsedSpec.info.title) {
      title = parsedSpec.info.title;
    }

    return (
      <React.Fragment>
        <div className="pad">{title}</div>
      </React.Fragment>
    );
  }
}

export default SpecEditorSidebar;