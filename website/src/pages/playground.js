import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Playground() {
	const context = useDocusaurusContext();
	const { siteConfig = {} } = context;
	console.log(context)
	return (
		<Layout
			title={`Hello from ${siteConfig.title}`}
			description="Description will go into a meta tag in <head />"
			noFooter={true}>
			<iframe id="playground" src={useBaseUrl("demo")}></iframe>
		</Layout>
	);
}

export default Playground;