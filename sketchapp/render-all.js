import * as React from 'react';
import * as PropTypes from 'prop-types';
import { render, Artboard, Text, View } from 'react-sketchapp';
import Home from '../renderer/pages/home'
import Running from '../renderer/components/home/running'
import Layout from '../renderer/components/Layout'

Home.componentWillUnmount = () => {};

Home.componentDidMount = () => {};

const Document = ({ colors }) => (
  <Artboard name="Running test">
    <Layout>
      <Running
        progressLine='test'
        percent={80}
        eta='10 seconds'
        runningTestName='Websites'
        logLines={['XXX']}
        error=''
        testGroupName='websites'
        onKill={()=>{}}
      />
    </Layout>
  </Artboard>
);

export default () => {
  render(<Document />, context.document.currentPage());
};
